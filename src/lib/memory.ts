import { createSupabaseServerClient } from "./supabase/server";
import { embed } from "./embeddings";

export type MatchedPrediction = {
  id: string;
  text: string;
  category: string | null;
  confidence: number;
  status: "pending" | "right" | "wrong" | "unclear";
  check_in_date: string;
  outcome_text: string | null;
  resolved_at: string | null;
  created_at: string;
  similarity: number;
};

/**
 * Vector search the user's prediction history. Returns [] if embeddings can't
 * be generated, the RPC fails, or no matches clear the threshold.
 */
export async function searchMemory(
  query: string,
  k = 6
): Promise<MatchedPrediction[]> {
  const queryVec = await embed(query);
  if (!queryVec) return [];

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.rpc("match_predictions", {
      query_embedding: queryVec,
      match_count: k,
      similarity_threshold: 0.2,
    });
    if (error) return [];
    return (data ?? []) as MatchedPrediction[];
  } catch {
    return [];
  }
}
