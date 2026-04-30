"use server";

import { auth } from "@clerk/nextjs/server";

import { searchMemory, type MatchedPrediction } from "@/lib/memory";
import { getGroq, GROQ_MODEL } from "@/lib/groq";

export type Citation = {
  id: string;
  text: string;
  date: string;
  status: MatchedPrediction["status"];
  confidence: number;
  similarity: number;
};

export type AskState =
  | { ok: true; answer: string; citations: Citation[] }
  | { ok: false; error: string };

const SYSTEM_PROMPT = `You are Hintsight's memory assistant. You answer questions about a user's
own past predictions using ONLY the citations provided.

Rules:
- Ground every claim in the citations. Cite by their inline tag, e.g. [#1], [#3].
- If the citations don't answer the question, say so plainly. Do not invent.
- Be concise. Plain prose, no markdown headings.
- Quote the user's exact wording sparingly when it sharpens the point.
- If the user asks for patterns ("where am I overconfident?"), summarise across the citations and reference the relevant ones.`;

const TIMEOUT_MS = 15000;

export async function askMemory(question: string): Promise<AskState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };
  if (!question || question.trim().length < 2) {
    return { ok: false, error: "Type a question first." };
  }

  const groq = getGroq();
  if (!groq) {
    return {
      ok: false,
      error:
        "AI isn't configured yet. Add GROQ_API_KEY (and HF_API_TOKEN for vector search) to .env.local.",
    };
  }

  const matches = await searchMemory(question, 6);

  if (matches.length === 0) {
    return {
      ok: true,
      answer:
        "I couldn't find any of your past predictions related to that — either none match, or embeddings aren't configured yet. Log a few predictions and ask again.",
      citations: [],
    };
  }

  const citations: Citation[] = matches.map((m) => ({
    id: m.id,
    text: m.text,
    date: m.created_at,
    status: m.status,
    confidence: m.confidence,
    similarity: m.similarity,
  }));

  const context = matches
    .map((m, i) => formatCitation(i + 1, m))
    .join("\n\n");

  const userPrompt = `Question: ${question}\n\nUser's prediction history (cite by [#n]):\n\n${context}`;

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
        temperature: 0.3,
        max_tokens: 600,
      },
      { signal: ac.signal }
    );
    clearTimeout(timer);

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ??
      "I couldn't form an answer.";

    return { ok: true, answer, citations };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Couldn't reach the model.",
    };
  }
}

function formatCitation(n: number, m: MatchedPrediction) {
  const status =
    m.status === "pending"
      ? "PENDING"
      : m.status === "right"
      ? "OUTCOME=RIGHT"
      : m.status === "wrong"
      ? "OUTCOME=WRONG"
      : "OUTCOME=UNCLEAR";
  const cat = m.category ? `category=${m.category}` : "category=none";
  const date = m.created_at.slice(0, 10);
  const outcome = m.outcome_text ? `\nNOTE: ${m.outcome_text}` : "";
  return `[#${n}] ${date} · ${cat} · confidence=${m.confidence}% · ${status}\nPREDICTION: ${m.text}${outcome}`;
}
