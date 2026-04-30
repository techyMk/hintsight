"use server";

import { auth } from "@clerk/nextjs/server";

import { extractPrediction, type Extraction } from "@/lib/extract";

export type SuggestState =
  | { ok: true; extraction: Extraction }
  | { ok: false; error: string };

export async function suggestExtraction(text: string): Promise<SuggestState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };
  if (!text || text.trim().length < 3) {
    return { ok: false, error: "Type at least a few words first." };
  }
  const extraction = await extractPrediction(text);
  if (!extraction.ok) {
    return {
      ok: false,
      error:
        extraction.reason === "groq-not-configured"
          ? "AI extraction isn't configured yet. Add GROQ_API_KEY to .env.local."
          : "Couldn't reach the model. Try again.",
    };
  }
  return { ok: true, extraction };
}
