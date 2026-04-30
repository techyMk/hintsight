import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Changelog — Hintsight",
  description:
    "Honest log of what shipped, what broke, and what got fixed while building Hintsight.",
};

type Entry = {
  date: string;
  title: string;
  kind: "ship" | "fix" | "polish";
  summary: string;
  details?: { label: string; body: React.ReactNode }[];
};

const ENTRIES: Entry[] = [
  {
    date: "2026-04-30",
    title: "Themed date picker, light/dark mode, real settings",
    kind: "polish",
    summary:
      "Replaced the native browser date overlay (which was breaking the design system) with a custom Calendar built on react-day-picker v9, theme-aware via Tailwind tokens. Added next-themes with a sun/moon toggle in every nav. Wired /settings actions for real — Export JSON / CSV downloads through the browser, Delete predictions has a two-step confirm, fake toggles removed.",
  },
  {
    date: "2026-04-30",
    title: "Lead-attracting landing upgrades",
    kind: "ship",
    summary:
      "Built an interactive 'Try one prediction' section on the landing — the form actually works, stores in localStorage, and converts to /sign-up. Added a forecasting research credibility section quoting Tetlock, Kahneman, and Annie Duke. Shipped SEO basics: sitemap.ts, robots.ts, JSON-LD SoftwareApplication structured data.",
  },
  {
    date: "2026-04-30",
    title: "Build crashed on Vercel with ERR_INVALID_URL",
    kind: "fix",
    summary:
      "First production deploy failed during static page generation with 'ERR_INVALID_URL — input: BAAI/bge-small-en-v1.5'. The HF embedding model name was being passed to a URL constructor.",
    details: [
      {
        label: "Root cause",
        body: (
          <>
            The Vercel <code className="font-mono text-foreground/90">NEXT_PUBLIC_SITE_URL</code>{" "}
            env var was misconfigured. The root layout&apos;s{" "}
            <code className="font-mono text-foreground/90">metadataBase: new URL(...)</code>{" "}
            crashed when given a malformed value, killing the build.
          </>
        ),
      },
      {
        label: "Fix",
        body: (
          <>
            Replaced the inline{" "}
            <code className="font-mono text-foreground/90">new URL()</code> with a
            <code className="font-mono text-foreground/90"> resolveMetadataBase()</code>{" "}
            function that tries{" "}
            <code className="font-mono text-foreground/90">NEXT_PUBLIC_SITE_URL</code>,
            falls back to{" "}
            <code className="font-mono text-foreground/90">VERCEL_URL</code> (auto-injected),
            and finally to localhost. Build can&apos;t crash on bad env input again.
          </>
        ),
      },
    ],
  },
  {
    date: "2026-04-29",
    title: "Sign-in completed but redirect didn't fire",
    kind: "fix",
    summary:
      "Auth flow accepted the verification code, created the Clerk session, but the user stayed stuck on /sign-in with a blank form area. Reproducible with a fresh incognito window.",
    details: [
      {
        label: "Symptom",
        body: "Sign-in form rendered, accepted email + verification code, then disappeared. URL stayed at /sign-in?redirect_url=/dashboard. No console errors. Hitting /dashboard manually bounced back to /sign-in. Classic infinite loop.",
      },
      {
        label: "Real root cause",
        body: (
          <>
            Server logs showed{" "}
            <code className="font-mono text-foreground/90">
              JWT cannot be used prior to not before date claim (nbf)
            </code>
            . The user&apos;s system clock was 29 seconds slow. Clerk issued tokens with{" "}
            <code className="font-mono text-foreground/90">nbf</code> in the
            &quot;future&quot; relative to local time → token rejected as
            not-yet-valid → server-side{" "}
            <code className="font-mono text-foreground/90">auth()</code> returned null →
            layout redirected to /sign-in → client knew user was signed in →
            redirect loop.
          </>
        ),
      },
      {
        label: "Fix",
        body: "User ran w32tm /resync to sync the system clock. The 'instance keys do not match' message Clerk surfaced was misleading — the actual cause was timing.",
      },
    ],
  },
  {
    date: "2026-04-29",
    title: "Next.js 16 proxy.ts vs middleware.ts",
    kind: "fix",
    summary:
      "After Next.js 16's deprecation warning, I renamed middleware.ts → proxy.ts. The auth flow then started rapidly redirecting between /sign-in and /dashboard infinitely.",
    details: [
      {
        label: "Why it broke",
        body: (
          <>
            Next.js 16&apos;s{" "}
            <code className="font-mono text-foreground/90">proxy.ts</code> runs in
            Node.js runtime by default and explicitly forbids{" "}
            <code className="font-mono text-foreground/90">
              export const runtime = &apos;edge&apos;
            </code>
            . Clerk&apos;s{" "}
            <code className="font-mono text-foreground/90">clerkMiddleware()</code>{" "}
            requires Edge runtime to attach the auth context to incoming requests.
            Under Node, server-side{" "}
            <code className="font-mono text-foreground/90">auth()</code> returned
            null even with valid sessions.
          </>
        ),
      },
      {
        label: "Fix",
        body: (
          <>
            Reverted to{" "}
            <code className="font-mono text-foreground/90">middleware.ts</code>{" "}
            and accepted the deprecation warning. Documented in CLAUDE.md why
            this stays as-is until Clerk ships proxy-compatible middleware.
            Removed{" "}
            <code className="font-mono text-foreground/90">auth.protect()</code>{" "}
            from middleware (it raced post-sign-in cookie propagation) and moved
            auth gating to the (app) layout where the cookie has settled.
          </>
        ),
      },
    ],
  },
  {
    date: "2026-04-29",
    title: "Predictions wouldn't save — RLS rejection",
    kind: "fix",
    summary:
      "Logged-in users hitting 'new row violates row-level security policy for table predictions' on every save attempt.",
    details: [
      {
        label: "Diagnosis",
        body: (
          <>
            Supabase third-party auth integration with Clerk was already configured
            (correct domain whitelisted). The RLS policy{" "}
            <code className="font-mono text-foreground/90">
              user_id = (select auth.jwt()-&gt;&gt;&apos;sub&apos;)
            </code>{" "}
            was matching, but the policy is{" "}
            <code className="font-mono text-foreground/90">to authenticated</code>{" "}
            — meaning the JWT must include{" "}
            <code className="font-mono text-foreground/90">role: &quot;authenticated&quot;</code>{" "}
            or Supabase treats the request as anon.
          </>
        ),
      },
      {
        label: "Fix",
        body: (
          <>
            In the Clerk dashboard, customized the session token claims to include{" "}
            <code className="font-mono text-foreground/90">{`{ "role": "authenticated" }`}</code>
            . User had to sign out + back in for the new token to issue.
          </>
        ),
      },
    ],
  },
  {
    date: "2026-04-29",
    title: "Phase 2–5: AI extraction, calibration math, vector memory",
    kind: "ship",
    summary:
      "Groq-powered structured extraction (category + confidence + due date from one sentence). HF Inference embeddings written to pgvector(384) on every prediction. Calibration math (Brier, decile bins, per-category) computed server-side. Memory chat that vector-searches your own history and answers with [#n] citations.",
  },
  {
    date: "2026-04-29",
    title: "Phase 1: scaffolding",
    kind: "ship",
    summary:
      "Next.js 16 + Tailwind v4 + shadcn primitives + Clerk auth + Supabase with RLS-scoped predictions table + HNSW index for vector search. Branded landing page, app shell with sidebar, settings, docs.",
  },
];

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <header className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Changelog
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.05] text-balance">
          What shipped, what broke,{" "}
          <span className="italic font-serif font-normal text-brand">
            what got fixed
          </span>
          .
        </h1>
        <p className="mt-5 text-muted-foreground text-pretty">
          A real, unedited log of building Hintsight. The fixes are kept here
          because the bugs are usually more interesting than the features.
        </p>
      </header>

      <div className="space-y-10">
        {ENTRIES.map((entry) => (
          <article
            key={`${entry.date}-${entry.title}`}
            className="grid sm:grid-cols-[100px_1fr] gap-4 sm:gap-6"
          >
            <div className="flex sm:flex-col gap-2 sm:gap-1.5 items-baseline sm:items-start sm:pt-1">
              <KindTag kind={entry.kind} />
              <time className="text-xs font-mono text-muted-foreground/80">
                {new Date(entry.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="border-l border-border pl-5 sm:pl-6 -ml-3 sm:-ml-0">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {entry.title}
              </h2>
              <p className="mt-2 text-foreground/85 leading-relaxed">
                {entry.summary}
              </p>
              {entry.details && (
                <dl className="mt-5 space-y-3 rounded-xl border border-border bg-card p-5">
                  {entry.details.map((d) => (
                    <div key={d.label}>
                      <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                        {d.label}
                      </dt>
                      <dd className="text-sm text-foreground/85 leading-relaxed">
                        {d.body}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border text-sm text-muted-foreground">
        <p>
          The source is on{" "}
          <a
            href="https://github.com/techyMk/hintsight"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline underline-offset-4 font-medium"
          >
            GitHub
          </a>
          . Commit history is honest about every wrong turn — that&apos;s where
          the real story is.
        </p>
      </div>
    </div>
  );
}

function KindTag({ kind }: { kind: Entry["kind"] }) {
  const variant = kind === "ship" ? "success" : kind === "fix" ? "danger" : "muted";
  const label = kind === "ship" ? "ship" : kind === "fix" ? "fix" : "polish";
  return (
    <Badge variant={variant} className="font-mono uppercase">
      {label}
    </Badge>
  );
}
