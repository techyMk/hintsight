@AGENTS.md

# Hintsight — context for Claude Code

This file is the durable handoff record for any Claude Code session opened in this folder. Read it first.

---

## What Hintsight is

**One-liner:** A fitness tracker for your judgment.

**Longer:** Users log a decision or prediction today. After a configurable check-in period (e.g. 30 days), Hintsight surfaces it and asks what really happened. Over time, calibration scores reveal where the user's judgment is sharp and where it drifts.

**Niche framing chosen deliberately:** the project is positioned as a calibration tool, NOT a generic AI chatbot. Resist any drift back to "AI assistant with memory" — that framing was rejected as too generic.

**Audience:** founders, PMs, investors, anyone who decides for a living. Universally relatable but specific enough to be memorable.

**Why this matters:** built as a **portfolio piece** for `techyMk` (Shoba) to attract clients. Every product/UX decision should serve that goal — looking polished, telling a clear story, demonstrating real engineering judgment.

---

## Stack (locked — do not swap without explicit user approval)

| Layer | Choice | Why locked |
|---|---|---|
| Framework | **Next.js 15** App Router, TypeScript, Turbopack | One deploy, streaming, hireability |
| UI | **Tailwind v4 + shadcn/ui** (Radix base, Nova preset) | Polished defaults |
| Auth | **Clerk** (free tier) | 5-min setup, Google sign-in |
| DB + Vector | **Supabase** (Postgres + pgvector) | Free tier covers MVP |
| LLM | **Groq** (`llama-3.3-70b-versatile`) | Free tier, fast |
| Embeddings | **Hugging Face Inference** (`BAAI/bge-small-en-v1.5`) | Free tier |
| Voice | **Browser Web Speech API** | No server STT/TTS needed |
| Charts | **Recharts** (Phase 4) | Calibration sparklines |
| Deploy | **Vercel** Hobby (free) | One-click from GitHub |

**Total cost target: $0/month** until product takes off.

---

## File structure

```
src/
├── app/
│   ├── layout.tsx                  # ClerkProvider + Geist + Instrument Serif
│   ├── page.tsx                    # Landing (hero + how it works + dark "mirror" section + CTA)
│   ├── sign-in/                    # Branded split-screen + Clerk SignIn (themed)
│   ├── sign-up/                    # Same, with value-prop side panel
│   └── (app)/                      # Auth-gated route group
│       ├── layout.tsx              # App shell (sticky header + sidebar + mobile bottom nav)
│       ├── dashboard/page.tsx      # Stats + calibration chart + by-category + recent
│       ├── log/                    # Quick Log form + actions + AI suggest preview
│       ├── reviews/                # Filtered list + right/wrong/unclear server action
│       ├── memory/                 # Vector-search-grounded chat with citations
│       └── settings/page.tsx       # Profile, preferences, data export, danger zone
├── components/
│   ├── ui/                         # shadcn primitives (button, card, badge, ...)
│   ├── brand/                      # logo, calibration arc, wordmark
│   └── app/                        # nav-link, icons, sparkline, calibration-chart, category-chart
├── lib/
│   ├── utils.ts                    # cn() helper
│   ├── supabase/server.ts          # Clerk-JWT-aware Supabase client
│   ├── groq.ts                     # Groq SDK factory (returns null if key missing)
│   ├── extract.ts                  # extractPrediction() — category + confidence + due_date
│   ├── embeddings.ts               # embed() via HF Inference API (384-dim BGE)
│   ├── memory.ts                   # searchMemory() — pgvector RPC
│   └── calibration.ts              # computeCalibration() — accuracy, Brier, bins, by-category
└── middleware.ts                   # Clerk route protection
supabase/migrations/
├── 0001_init.sql                   # predictions table + RLS
└── 0002_memory.sql                 # HNSW index + match_predictions RPC
scripts/
└── seed-demo.ts                    # `npm run seed <clerk_user_id>` — demo prediction history
```

Routes protected by `middleware.ts`: `/dashboard`, `/log`, `/reviews`, `/memory`, `/settings`.

---

## Phases

| Phase | Scope | Status |
|---|---|---|
| **1 — Scaffold** | Next.js + Tailwind + shadcn + Clerk + Supabase wired, landing page, sign-in/up, dashboard, app shell | Done |
| **2 — Logging** | Schema, Quick Log form, server action insert, Groq extraction, HF embeddings, "AI suggest" inline preview | Done |
| **3 — Reviews** | /reviews page with filters, mark right/wrong/unclear server action, calibration math (`lib/calibration.ts`), real numbers wired to dashboard | Done |
| **4 — Dashboard** | Recharts calibration plot (predicted vs observed with diagonal), Recharts category bar chart, real per-category accuracy | Done |
| **5 — Memory chat** | HNSW index migration, `match_predictions` RPC, vector-search `lib/memory.ts`, Groq-grounded chat with `[#n]` citations | Done |
| **6 — Polish + deploy** | Demo seed script (`npm run seed <user_id>`), CLAUDE.md updated, deploy guide below | Done |

---

## Deploy notes (Vercel)

1. Push the repo to GitHub.
2. Import in https://vercel.com → New Project → select repo → Framework: Next.js (auto).
3. Add the same env vars from `.env.local` to **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`,
     `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`,
     `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`, `GROQ_MODEL`
   - `HF_API_TOKEN`, `HF_EMBEDDING_MODEL`
4. **Do NOT** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel — it's for the local seed script only.
5. After first deploy, in Clerk dashboard → **Domains** → add the Vercel URL as a permitted origin.
6. Run the migrations against Supabase: paste `supabase/migrations/0001_init.sql` then `0002_memory.sql` into the Supabase SQL editor.
7. (Optional) Seed demo data once locally: `npm run seed <your_clerk_user_id>` (requires `SUPABASE_SERVICE_ROLE_KEY` uncommented in `.env.local`).

---

## Phase plan (historical)

The original session-by-session plan is preserved below for context. All phases are now complete; future work goes against this scope.

**Phase 2** — extraction lives at [lib/extract.ts](src/lib/extract.ts), embeddings at [lib/embeddings.ts](src/lib/embeddings.ts), wired through [logPrediction action](src/app/(app)/log/actions.ts) and exposed as an "AI suggest" preview button in [quick-log-form.tsx](src/app/(app)/log/quick-log-form.tsx).

**Phase 3** — calibration math at [lib/calibration.ts](src/lib/calibration.ts) (Brier, accuracy, bin-by-decile observed accuracy, per-category breakdown, average gap). Headline number unlocks at 5 reviewed predictions; per-category card at 5 per category.

**Phase 4** — Recharts plots at [calibration-chart.tsx](src/components/app/calibration-chart.tsx) (predicted vs observed with diagonal reference) and [category-chart.tsx](src/components/app/category-chart.tsx) (horizontal bar tinted by accuracy band).

**Phase 5** — `match_predictions(query_embedding, k, threshold)` RPC scoped to the calling Clerk user, called from [lib/memory.ts](src/lib/memory.ts), grounded answers via [memory/actions.ts](src/app/(app)/memory/actions.ts) → Groq with `[#n]` citation tags rendered in [memory-chat.tsx](src/app/(app)/memory/memory-chat.tsx).

---

## Coding conventions

- **TypeScript strict** — no `any` unless interop forces it.
- **Server Components by default**; only `"use client"` when needed (forms, hooks, animations).
- **Server Actions** for mutations, not REST API routes (unless needed for streaming).
- **shadcn components** — never restyle their primitives directly; compose via `className` overrides.
- **Tailwind v4** — uses CSS variables; check `globals.css` for the design tokens.
- **Path alias** — `@/*` → `./src/*`.
- **No emojis** in code or copy unless user asks.
- **No README files** unless user asks. (CLAUDE.md is a context file, not docs — different rule.)
- **Comments:** rare, only for non-obvious *why*. Don't narrate what the code does.
- **Brand voice:** confident, lowercase-feeling, anti-marketing. Read existing landing-page copy in `app/page.tsx` for tone reference.

---

## Services & where to get keys

| Service | URL | What to copy |
|---|---|---|
| Clerk | https://dashboard.clerk.com | `pk_test_...` and `sk_test_...` from API Keys |
| Supabase | https://supabase.com/dashboard | Project URL, anon key, service_role key (Settings → API) |
| Groq | https://console.groq.com/keys | `gsk_...` |
| Hugging Face | https://huggingface.co/settings/tokens | `hf_...` (read scope is enough) |
| Vercel | https://vercel.com | (Phase 6) connect GitHub repo |

User confirmed accounts are created. Keys go in `.env.local` (template at `.env.local.example`). `.env.local` is gitignored.

---

## How to run

```powershell
cd C:\Users\shoba\OneDrive\Documents\hintsight
npm run dev
```

Opens on http://localhost:3000. Without Clerk keys in `.env.local`, the app errors with `Missing publishableKey`.

---

## Things to actively avoid

- **Don't broaden the niche.** "AI assistant for productivity" / "personal knowledge base" / "general chatbot" — all rejected. Hintsight is a calibration tool. Period.
- **Don't add features outside the phase plan** without user approval.
- **Don't introduce new SDKs** when an existing one fits (e.g., don't add LangChain.js if a 30-line Groq call works).
- **Don't write README.md, ARCHITECTURE.md, CONTRIBUTING.md** unless the user asks. CLAUDE.md (this file) is the exception because it's the Claude Code context system.
- **Don't migrate back to Streamlit / Python.** The user has a separate `memexa/` Python project that serves as the "local-first private mode" portfolio piece. Don't conflate the two.
- **Don't deploy or git push** without explicit user instruction.

---

## Related artifacts

- `../memexa/` — the Python/Streamlit "local mode" sibling project (LangChain + Ollama + ChromaDB). Different stack, different positioning. Reference, not dependency.
- This file lives at `hintsight/CLAUDE.md` and is checked into git.

---

## When in doubt

Ask the user. They are decisive but expect to be consulted on direction changes. Confirm before:
- Changing the niche or product framing
- Adding/removing major dependencies
- Deploying anything
- Deleting files outside `node_modules` or build output
