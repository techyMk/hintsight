import Link from "next/link";
import { Show } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoMark, Wordmark } from "@/components/brand/logo";
import { CalibrationArc } from "@/components/brand/calibration-arc";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background font-sans">
      <Nav />
      <Hero />
      <SocialProofStrip />
      <HowItWorks />
      <ProductPreview />
      <WhyDifferent />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="w-full border-b border-border/60 bg-background/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Hintsight home">
          <Wordmark />
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link
            href="#how"
            className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#why"
            className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Why it&apos;s different
          </Link>
          <Link
            href="/docs"
            className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <Button render={<Link href="/sign-in" />} nativeButton={false} variant="ghost" size="sm">
              Sign in
            </Button>
            <Button render={<Link href="/sign-up" />} nativeButton={false} size="sm">
              Get started
            </Button>
          </Show>
          <Show when="signed-in">
            <Button render={<Link href="/dashboard" />} nativeButton={false} size="sm">
              Open app
            </Button>
          </Show>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative grid background */}
      <div
        className="absolute inset-0 grid-bg radial-fade pointer-events-none opacity-60"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-foreground/[0.04] to-transparent pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="flex flex-col items-center text-center">
          <Badge variant="outline" className="mb-6 text-xs">
            <span className="size-1.5 rounded-full bg-brand" />
            Now in private beta
          </Badge>

          <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-foreground leading-[0.98] text-balance">
            A scoreboard
            <br />
            for your{" "}
            <span className="italic font-serif font-normal text-brand">
              judgment
            </span>
            .
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
            Log a decision today. In 30 days, Hintsight asks what really
            happened. Over time, you see how good your judgment actually is —
            not how good you think it is.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Show when="signed-out">
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                size="lg"
                className="h-12 px-7 text-base"
              >
                Start tracking — it&apos;s free
              </Button>
              <Button
                render={<Link href="#how" />}
                nativeButton={false}
                variant="ghost"
                size="lg"
                className="h-12 px-6 text-base"
              >
                See how it works →
              </Button>
            </Show>
            <Show when="signed-in">
              <Button
                render={<Link href="/dashboard" />}
                nativeButton={false}
                size="lg"
                className="h-12 px-7 text-base"
              >
                Open your dashboard →
              </Button>
            </Show>
          </div>

          <p className="mt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground/70">
            Free, forever · No credit card · Open source
          </p>
        </div>

        {/* Hero visual */}
        <div className="mt-20 mx-auto max-w-4xl">
          <div className="relative rounded-3xl border border-border/80 bg-card shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="border-b border-border/60 px-5 py-3 flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-400/80" />
                <span className="size-2.5 rounded-full bg-amber-400/80" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                hintsight.app/dashboard
              </span>
              <div className="w-12" />
            </div>
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-0">
              <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-border/60">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Calibration · last 12 weeks
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-semibold tracking-tight tabular-nums">
                    68<span className="text-brand">%</span>
                  </span>
                  <Badge variant="success">+4 vs prior 12w</Badge>
                </div>
                <div className="mt-6 text-foreground/80">
                  <CalibrationArc className="text-foreground" />
                </div>
              </div>
              <div className="p-8 sm:p-10 space-y-5 bg-muted/20">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Recent
                  </p>
                </div>
                <PredictionPreviewItem
                  text="Client signs the contract by Friday."
                  category="deals"
                  confidence={70}
                  outcome="right"
                />
                <PredictionPreviewItem
                  text="We&apos;ll ship the redesign before quarter-end."
                  category="product"
                  confidence={55}
                  outcome="wrong"
                />
                <PredictionPreviewItem
                  text="New hire stays past 6 months."
                  category="hiring"
                  confidence={85}
                  outcome="pending"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PredictionPreviewItem({
  text,
  category,
  confidence,
  outcome,
}: {
  text: string;
  category: string;
  confidence: number;
  outcome: "right" | "wrong" | "pending";
}) {
  const dotMap = {
    right: "bg-emerald-500",
    wrong: "bg-rose-500",
    pending: "bg-amber-400 animate-pulse",
  } as const;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs">
        <span className={`size-1.5 rounded-full ${dotMap[outcome]}`} />
        <span className="font-mono uppercase tracking-widest text-muted-foreground">
          {category}
        </span>
        <span className="text-muted-foreground/60">·</span>
        <span className="font-mono text-muted-foreground">{confidence}%</span>
      </div>
      <p
        className="text-sm text-foreground leading-snug"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

function SocialProofStrip() {
  return (
    <section className="border-y border-border/60 bg-muted/20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Built for people who decide for a living
        </p>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {["Founders", "Investors", "Product leaders", "Operators"].map(
            (group) => (
              <div
                key={group}
                className="text-sm text-foreground/70 font-medium"
              >
                {group}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Log a prediction",
      body: "Type or speak a decision. The AI extracts a category, a confidence level, and a check-in date.",
      sample: "“This client will sign by Friday. ~70% confident.”",
    },
    {
      n: "02",
      title: "Forget about it",
      body: "Hintsight holds it quietly. You go live your life. No nagging notifications, no streaks.",
      sample: "—",
    },
    {
      n: "03",
      title: "Reckon with the outcome",
      body: "On the check-in date, Hintsight surfaces the prediction and asks: what really happened?",
      sample: "“Yes. Signed Thursday. Earlier than I thought.”",
    },
    {
      n: "04",
      title: "See your patterns",
      body: "After 20+ predictions you see calibration scores by category, by confidence, over time.",
      sample: "Hiring 73% · Deals 41% · Product 62%",
    },
  ];

  return (
    <section id="how" className="px-6 py-24 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-foreground text-balance">
            Four steps. No streaks. No gamification.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground text-pretty">
            Just honest feedback about how often you&apos;re right.
          </p>
        </div>
        <div className="mt-16 grid sm:grid-cols-2 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative border border-border/80 rounded-2xl p-8 bg-card hover:bg-card/80 transition-all hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono text-muted-foreground/70 tracking-widest">
                  STEP {s.n}
                </span>
                <span className="size-8 rounded-full border border-border flex items-center justify-center text-xs font-mono text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground transition-colors">
                  →
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {s.body}
              </p>
              <div className="mt-6 pt-5 border-t border-dashed border-border">
                <p className="text-sm font-mono text-muted-foreground italic">
                  {s.sample}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <section id="preview" className="px-6 py-24 sm:py-28 border-t border-border/60 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Inside the app
          </p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-foreground text-balance">
            One screen for the prediction. One for the truth.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-5">
          <PreviewCard
            label="Quick log"
            title="A single textarea. AI does the parsing."
            body="Confidence, category, check-in date — all extracted from one sentence."
          >
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Your prediction
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-sm text-foreground/90 leading-relaxed">
                We&apos;ll close the seed round before the end of next month. Not certain — call it 65%.
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="accent">finance</Badge>
                <Badge variant="muted">65% confident</Badge>
                <Badge variant="muted">check in: 2026-05-31</Badge>
              </div>
            </div>
          </PreviewCard>

          <PreviewCard
            label="Reviews"
            title="The honest part."
            body="When the day arrives, mark it right or wrong. Add what really happened."
          >
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                  <span className="size-2 rounded-full bg-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Logged 30 days ago
                  </div>
                  <div className="mt-1 text-sm text-foreground leading-snug">
                    The redesign ships before quarter-end. ~55%.
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-9 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                  Right
                </button>
                <button className="flex-1 h-9 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-sm font-medium hover:bg-rose-500/20 transition-colors">
                  Wrong
                </button>
              </div>
            </div>
          </PreviewCard>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  label,
  title,
  body,
  children,
}: {
  label: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border/80 rounded-2xl p-8 bg-card">
      <div className="flex items-center gap-2">
        <Badge variant="muted">{label}</Badge>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-muted-foreground">{body}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function WhyDifferent() {
  const points = [
    {
      title: "Not advice. Evidence.",
      body: "Most AI tells you what to do. Hintsight tells you what you said and what really happened. You decide what to make of it.",
    },
    {
      title: "Built for slow loops.",
      body: "Days, weeks, months — not minutes. Hintsight is for the kind of judgment that takes time to validate.",
    },
    {
      title: "Private by default.",
      body: "Your predictions are yours. No public feeds, no leaderboards, no model training on your data.",
    },
  ];

  return (
    <section
      id="why"
      className="relative px-6 py-28 sm:py-32 bg-foreground text-background overflow-hidden"
    >
      <div
        className="absolute inset-0 dot-bg opacity-15 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-brand/10 blur-3xl pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-widest text-background/60">
            What makes it different
          </p>
          <h2 className="mt-4 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1] text-balance">
            It&apos;s not another note-taker.
            <br />
            <span className="italic font-serif font-normal text-brand">
              It&apos;s a mirror.
            </span>
          </h2>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-px bg-background/15 rounded-2xl overflow-hidden">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="bg-foreground p-8 sm:p-10 flex flex-col"
            >
              <div className="text-xs font-mono tracking-widest text-brand/90">
                0{i + 1}
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="mt-3 text-background/70 leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-6 py-24 sm:py-32 border-t border-border/60 relative overflow-hidden">
      <div className="absolute inset-0 dot-bg radial-fade opacity-50 pointer-events-none" aria-hidden />
      <div className="relative max-w-2xl mx-auto text-center">
        <div className="mx-auto size-14 rounded-2xl bg-foreground text-background flex items-center justify-center mb-8">
          <LogoMark size={28} className="text-background" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground text-balance">
          Stop guessing how good your{" "}
          <span className="italic font-serif font-normal text-brand">
            judgment
          </span>{" "}
          is.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Start measuring it. Free, forever.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
          <Show when="signed-out">
            <Button
              render={<Link href="/sign-up" />}
              nativeButton={false}
              size="lg"
              className="h-12 px-7 text-base"
            >
              Create your account
            </Button>
            <Button
              render={<Link href="/sign-in" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="h-12 px-7 text-base"
            >
              I already have one
            </Button>
          </Show>
          <Show when="signed-in">
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              size="lg"
              className="h-12 px-7 text-base"
            >
              Open your dashboard
            </Button>
          </Show>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-border/60 mt-auto bg-background">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <Wordmark className="text-foreground" />
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            A scoreboard for your judgment.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 text-sm">
          <Link href="#how" className="text-muted-foreground hover:text-foreground">
            How it works
          </Link>
          <Link href="/docs" className="text-muted-foreground hover:text-foreground">
            Docs
          </Link>
          <a
            href="https://github.com/techyMk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
        </div>
        <p className="text-xs text-muted-foreground/70 font-mono">
          © {new Date().getFullYear()} Hintsight · Built by techyMk
        </p>
      </div>
    </footer>
  );
}
