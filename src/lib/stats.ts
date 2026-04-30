import { createClient } from "@supabase/supabase-js";

export type PublicStats = {
  totalPredictions: number;
  totalForecasters: number;
  totalReviewed: number;
};

const FALLBACK: PublicStats = {
  totalPredictions: 0,
  totalForecasters: 0,
  totalReviewed: 0,
};

let cached: { value: PublicStats; expiresAt: number } | null = null;
const TTL_MS = 60_000;

/**
 * Aggregate stats for the public landing page. Cached in-memory for 60s
 * to avoid hammering Supabase from every visitor request. No PII —
 * the underlying SQL function returns only counts.
 *
 * Returns zeros if Supabase is unreachable or the migration hasn't run.
 */
export async function getPublicStats(): Promise<PublicStats> {
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return FALLBACK;

  try {
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await client.rpc("public_stats");
    if (error || !data || !Array.isArray(data) || data.length === 0) {
      return FALLBACK;
    }
    const row = data[0] as {
      total_predictions: number | string;
      total_forecasters: number | string;
      total_reviewed: number | string;
    };
    const value: PublicStats = {
      totalPredictions: Number(row.total_predictions) || 0,
      totalForecasters: Number(row.total_forecasters) || 0,
      totalReviewed: Number(row.total_reviewed) || 0,
    };
    cached = { value, expiresAt: Date.now() + TTL_MS };
    return value;
  } catch {
    return FALLBACK;
  }
}
