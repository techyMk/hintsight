"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ReviewState = { error?: string; ok?: boolean };
export type Outcome = "right" | "wrong" | "unclear";

export async function submitReview(input: {
  id: string;
  outcome: Outcome;
  outcome_text: string | null;
}): Promise<ReviewState> {
  const { userId } = await auth();
  if (!userId) return { error: "Not signed in." };

  if (!input.id) return { error: "Missing prediction id." };
  if (
    input.outcome !== "right" &&
    input.outcome !== "wrong" &&
    input.outcome !== "unclear"
  ) {
    return { error: "Invalid outcome." };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error: updateError } = await supabase
      .from("predictions")
      .update({
        status: input.outcome,
        outcome_text: input.outcome_text,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", input.id);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath("/reviews");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}
