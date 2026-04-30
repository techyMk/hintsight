import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/app/icons";

export const metadata = {
  title: "About — Hintsight",
  description:
    "Why Hintsight exists, who built it, and what techyMk is available for.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <header className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          About
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.05] text-balance">
          Built by one person,{" "}
          <span className="italic font-serif font-normal text-brand">
            for people who decide for a living
          </span>
          .
        </h1>
      </header>

      <div className="space-y-12 text-foreground/85 leading-relaxed">
        <Section title="Why Hintsight exists">
          <p>
            Most software for thinking is a journal: it records what you
            thought, and lets you feel thoughtful re-reading it. That&apos;s
            not the same as actually getting better.
          </p>
          <p>
            Calibration — the gap between how confident you said you were and
            how often you were right — is one of the few measurable signals
            of judgment. It&apos;s what separates Tetlock&apos;s
            superforecasters from random pundits. And it requires only one
            thing: writing down a number before you know the answer.
          </p>
          <p>
            Hintsight does that one thing well. Log a prediction with a stated
            probability. Wait. On the date you said you&apos;d know by, mark
            it right or wrong. Repeat. Eventually you have data on yourself.
          </p>
        </Section>

        <Section title="Who built this">
          <div className="flex items-start gap-5">
            <Image
              src="/icon.webp"
              alt="techyMk"
              width={64}
              height={64}
              priority
              className="size-16 rounded-2xl object-cover flex-shrink-0 ring-1 ring-border"
            />
            <div className="flex-1 space-y-3">
              <p>
                Hintsight is built by{" "}
                <a
                  href="https://techymk.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand"
                >
                  techyMk
                </a>{" "}
                — a full-stack engineer who builds production-grade web
                apps with modern stacks. Currently focused on AI-native
                products that actually solve a problem.
              </p>
              <p className="text-muted-foreground text-sm">
                Hintsight is the public-facing portfolio piece — the kind of
                thing recruiters and clients can poke at to see how I think
                about product, design, and engineering.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Engineering philosophy">
          <ul className="space-y-4">
            <Principle title="Ship the boring layer first.">
              Auth, routing, RLS, and CI go in before features. Most of the
              hard bugs in this build (read the{" "}
              <Link
                href="/changelog"
                className="text-foreground font-medium underline underline-offset-4"
              >
                changelog
              </Link>
              ) happened at that boring layer. Get it solid and the rest moves.
            </Principle>
            <Principle title="Defensive against my own failures, not the user's.">
              Validate at boundaries (forms, env vars, AI calls). Don&apos;t
              spray try/catch through the happy path. The{" "}
              <code className="font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-foreground/[0.06] text-foreground/90">
                resolveMetadataBase()
              </code>{" "}
              fallback chain after the Vercel ERR_INVALID_URL incident is the
              kind of thing I add once, not preemptively.
            </Principle>
            <Principle title="No fake controls.">
              Every button on this site does something real. No greyed-out
              &quot;coming soon&quot; toggles, no decorative dropdowns. If
              I can&apos;t ship the action, I don&apos;t ship the UI.
            </Principle>
            <Principle title="Brand voice is anti-marketing.">
              Lowercase-feeling, confident, no superlatives. The product
              should make a case for itself; copy that begs is a tell.
            </Principle>
            <Principle title="The bug-fight history is the portfolio.">
              Anyone can scaffold features. The signal is in how you debug
              under uncertainty — JWT clock skew, Edge runtime mismatches,
              third-party RLS claim integration — that&apos;s the work that
              shows up in real jobs.
            </Principle>
          </ul>
        </Section>

        <Section title="The stack, briefly">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <StackRow label="Framework" value="Next.js 16, App Router, Turbopack" />
              <StackRow label="Language" value="TypeScript strict" />
              <StackRow label="Styling" value="Tailwind v4 + shadcn primitives" />
              <StackRow label="Auth" value="Clerk (Edge runtime middleware)" />
              <StackRow label="Database" value="Supabase Postgres + RLS" />
              <StackRow label="Vector search" value="pgvector with HNSW index" />
              <StackRow label="LLM" value="Groq (Llama 3.3 70B)" />
              <StackRow label="Embeddings" value="HF Inference (BAAI/bge)" />
              <StackRow label="Charts" value="Recharts + custom SVG" />
              <StackRow label="Tests" value="Playwright + GitHub Actions" />
              <StackRow label="Hosting" value="Vercel" />
              <StackRow label="Cost to run" value="$0/month" />
            </dl>
          </div>
        </Section>

        <Section title="Available for work">
          <p>
            Building something where the hard part is the engineering, not the
            product surface? Drop a note. I&apos;m available for:
          </p>
          <ul className="space-y-2 my-4 list-disc list-inside marker:text-brand">
            <li>Full-stack web apps with AI integration</li>
            <li>Migration / modernization (legacy → Next.js, App Router)</li>
            <li>Product engineering with real design taste</li>
            <li>Auth + data architecture audits</li>
          </ul>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              render={
                <a
                  href="mailto:it@lancers.in?subject=Hintsight%20%E2%80%94%20available%20for%20work"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              size="lg"
              className="h-11 px-6"
            >
              Get in touch
              <ArrowRightIcon />
            </Button>
            <Button
              render={
                <a
                  href="https://techymk.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              variant="outline"
              size="lg"
              className="h-11 px-6"
            >
              Full portfolio ↗
            </Button>
            <Button
              render={
                <a
                  href="https://github.com/techyMk"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              variant="ghost"
              size="lg"
              className="h-11 px-6"
            >
              GitHub
            </Button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Principle({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-[8px_1fr] gap-3 items-start list-none">
      <span className="size-2 rounded-full bg-brand mt-2" />
      <div>
        <strong className="text-foreground font-semibold">{title}</strong>{" "}
        <span className="text-foreground/85">{children}</span>
      </div>
    </li>
  );
}

function StackRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-muted-foreground font-mono uppercase tracking-widest text-[10px] self-center">
        {label}
      </dt>
      <dd className="text-foreground/90">{value}</dd>
    </>
  );
}
