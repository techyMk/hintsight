import Groq from "groq-sdk";

let cached: Groq | null = null;

export function getGroq(): Groq | null {
  if (cached) return cached;
  const key = process.env.GROQ_API_KEY;
  if (!key || key.startsWith("gsk_xxxx")) return null;
  cached = new Groq({ apiKey: key });
  return cached;
}

export const GROQ_MODEL =
  process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";
