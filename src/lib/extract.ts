import { getGroq, GROQ_MODEL } from "./groq";

export type Category =
  | "deals"
  | "hiring"
  | "product"
  | "finance"
  | "personal"
  | "other";

export const CATEGORIES: Category[] = [
  "deals",
  "hiring",
  "product",
  "finance",
  "personal",
  "other",
];

export type Extraction = {
  category: Category | null;
  confidence: number | null;
  due_date: string | null;
  ok: boolean;
  reason?: string;
};

const SYSTEM_PROMPT = `You extract structured data from a user's prediction or decision.

Return STRICT JSON only, with exactly this shape:
{
  "category": "deals" | "hiring" | "product" | "finance" | "personal" | "other",
  "confidence": <integer 0..100 or null>,
  "due_date": "YYYY-MM-DD" | null
}

Rules:
- "category": classify the prediction. Use "other" if none clearly fit.
- "confidence": extract any explicit % (e.g. "70%", "60 percent", "high confidence" -> 80, "coin flip" -> 50). null if absent.
- "due_date": resolve any explicit timeframe to an absolute date based on TODAY. "Friday" -> next Friday's date. "next month" -> first day of next month. "in 2 weeks" -> today+14. null if absent or ambiguous.
- Output JSON only. No prose, no fences, no code blocks.`;

const TIMEOUT_MS = 8000;

function pickIso(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function extractPrediction(
  text: string,
  today: Date = new Date()
): Promise<Extraction> {
  const groq = getGroq();
  if (!groq) {
    return {
      category: null,
      confidence: null,
      due_date: null,
      ok: false,
      reason: "groq-not-configured",
    };
  }

  const todayIso = pickIso(today);
  const userPrompt = `TODAY: ${todayIso}\n\nPrediction: ${text}`;

  try {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
    const completion = await groq.chat.completions.create(
      {
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 200,
      },
      { signal: ac.signal }
    );
    clearTimeout(timer);

    const raw = completion.choices?.[0]?.message?.content?.trim() ?? "{}";
    const parsed = safeJson(raw);

    return {
      category: normaliseCategory(parsed?.category),
      confidence: normaliseConfidence(parsed?.confidence),
      due_date: normaliseDate(parsed?.due_date, today),
      ok: true,
    };
  } catch (e) {
    return {
      category: null,
      confidence: null,
      due_date: null,
      ok: false,
      reason: e instanceof Error ? e.message : "extraction-failed",
    };
  }
}

function safeJson(s: string): Record<string, unknown> | null {
  try {
    const cleaned = s.replace(/^```json\n?/, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function normaliseCategory(v: unknown): Category | null {
  if (typeof v !== "string") return null;
  const lc = v.toLowerCase().trim();
  return (CATEGORIES as string[]).includes(lc) ? (lc as Category) : null;
}

function normaliseConfidence(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normaliseDate(v: unknown, today: Date): string | null {
  if (typeof v !== "string") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const t = Date.parse(v + "T00:00:00Z");
  if (Number.isNaN(t)) return null;
  // Reject anything in the past — model misreading is more likely than the user
  // wanting a backward-looking prediction.
  const todayUtc = Date.parse(pickIso(today) + "T00:00:00Z");
  if (t < todayUtc) return null;
  return v;
}
