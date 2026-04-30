/**
 * Hugging Face Inference API for sentence embeddings.
 * Model: BAAI/bge-small-en-v1.5 — 384-dim, free-tier friendly.
 *
 * Returns null on any error (missing token, rate limit, model warming up,
 * network blip). Callers MUST tolerate null embeddings — predictions still
 * insert without one; vector search just skips them.
 */

const MODEL =
  process.env.HF_EMBEDDING_MODEL?.trim() || "BAAI/bge-small-en-v1.5";
const ENDPOINT = `https://api-inference.huggingface.co/pipeline/feature-extraction/${MODEL}`;
const TIMEOUT_MS = 12000;
const EXPECTED_DIM = 384;

export async function embed(text: string): Promise<number[] | null> {
  const token = process.env.HF_API_TOKEN;
  if (!token || token.startsWith("hf_xxxx")) return null;

  const trimmed = text.trim();
  if (trimmed.length === 0) return null;

  try {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      signal: ac.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: trimmed,
        options: { wait_for_model: true },
      }),
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const data = (await res.json()) as unknown;
    const vec = coerceVector(data);
    if (!vec || vec.length !== EXPECTED_DIM) return null;
    return vec;
  } catch {
    return null;
  }
}

/**
 * HF pipeline output shapes vary: a single embedding can come back as
 *   number[] (plain vector) OR
 *   number[][] (one per token, when pooling is off) OR
 *   number[][][] (batched).
 * We unwrap to a single number[] and only accept a sane numeric vector.
 */
function coerceVector(data: unknown): number[] | null {
  if (!Array.isArray(data) || data.length === 0) return null;

  // number[]
  if (typeof data[0] === "number") {
    return (data as number[]).every((n) => Number.isFinite(n))
      ? (data as number[])
      : null;
  }

  // number[][]
  if (Array.isArray(data[0])) {
    const first = data[0] as unknown[];
    if (first.length === 0) return null;
    if (typeof first[0] === "number") {
      // Mean-pool token-level outputs into a single vector.
      const tokens = data as number[][];
      const dim = tokens[0].length;
      const sum = new Array<number>(dim).fill(0);
      for (const t of tokens) {
        if (t.length !== dim) return null;
        for (let i = 0; i < dim; i++) sum[i] += t[i];
      }
      return sum.map((v) => v / tokens.length);
    }

    // number[][][] — pick the first batch element and recurse.
    return coerceVector(first);
  }

  return null;
}

export const EMBEDDING_DIM = EXPECTED_DIM;
