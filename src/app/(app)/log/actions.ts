"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { extractPrediction } from "@/lib/extract";
import { embed } from "@/lib/embeddings";

export type LogPredictionState = {
  error?: string;
  ok?: boolean;
};

export async function logPrediction(
  _prev: LogPredictionState,
  formData: FormData
): Promise<LogPredictionState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in." };
  }

  const text = String(formData.get("text") ?? "").trim();
  const rawConfidence = String(formData.get("confidence") ?? "");
  const checkInDate = String(formData.get("check_in_date") ?? "");
  const categoryInput = String(formData.get("category") ?? "").trim();

  if (text.length < 3) {
    return { error: "Tell us what you're predicting (at least 3 characters)." };
  }
  if (text.length > 4000) {
    return { error: "That's a lot. Keep it under 4000 characters." };
  }

  const confidence = Number.parseInt(rawConfidence, 10);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 100) {
    return { error: "Confidence must be between 0 and 100." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkInDate)) {
    return { error: "Pick a check-in date." };
  }
  const checkInTime = Date.parse(`${checkInDate}T00:00:00Z`);
  if (Number.isNaN(checkInTime)) {
    return { error: "That check-in date doesn't look right." };
  }
  const todayUtc = Date.parse(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
  if (checkInTime < todayUtc) {
    return { error: "Check-in date must be in the future." };
  }

  // AI enrichment runs in parallel and is allowed to fail silently. We only
  // use the extracted category if the user didn't provide one.
  const [extraction, embedding] = await Promise.all([
    extractPrediction(text),
    embed(text),
  ]);

  const finalCategory =
    categoryInput.length > 0
      ? categoryInput.toLowerCase().slice(0, 64)
      : extraction.category ?? null;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("predictions").insert({
    user_id: userId,
    text,
    confidence,
    check_in_date: checkInDate,
    category: finalCategory,
    embedding,
  });

  if (error) {
    return { error: `Couldn't save: ${error.message}` };
  }

  revalidatePath("/dashboard");
  revalidatePath("/reviews");
  return { ok: true };
}
