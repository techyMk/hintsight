"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; ok?: boolean; count?: number };

export async function deleteAllPredictions(): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { error: "Not signed in." };

  try {
    const supabase = createSupabaseServerClient();
    // RLS scopes the delete to the calling user automatically — we still
    // pass the explicit filter so the query's intent is unambiguous.
    const { error, count } = await supabase
      .from("predictions")
      .delete({ count: "exact" })
      .eq("user_id", userId);

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/reviews");
    revalidatePath("/memory");
    return { ok: true, count: count ?? 0 };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export type ExportRow = {
  id: string;
  text: string;
  category: string | null;
  confidence: number;
  status: "pending" | "right" | "wrong" | "unclear";
  check_in_date: string;
  outcome_text: string | null;
  resolved_at: string | null;
  created_at: string;
};

export async function getAllPredictionsForExport(): Promise<
  | { ok: true; rows: ExportRow[] }
  | { ok: false; error: string }
> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("predictions")
      .select(
        "id, text, category, confidence, status, check_in_date, outcome_text, resolved_at, created_at"
      )
      .order("created_at", { ascending: true });

    if (error) return { ok: false, error: error.message };
    return { ok: true, rows: (data ?? []) as ExportRow[] };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
