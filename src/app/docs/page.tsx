import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/app/icons";

export const metadata = {
  title: "Docs — Hintsight",
  description: "How Hintsight works, how to log a great prediction, and what calibration actually means.",
};

const SECTIONS = [
  { id: "what", label: "What it is" },
  { id: "loop", label: "The four-step loop" },
  { id: "logging", label: "Logging well" },
  { id: "confidence", label: "Picking a confidence" },
  { id: "calibration", label: "What calibration means" },
  { id: "memory", label: "Memory chat" },
  { id: "privacy", label: "Privacy & data" },
  { id: "faq", label: "FAQ" },
];

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 sm:py-16 grid lg:grid-cols-[200px_1fr] gap-10">
      <aside className="hidden lg:block">
        <nav className="sticky top-20 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
            On this page
          </p>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 max-w-2xl">
        <header className="mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Documentation
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.05] text-balance">
            How Hintsight{" "}
            <span className="italic font-serif font-normal text-brand">
              actually works
            </span>
            .
          </h1>
          <p className="mt-5 text-lg text-muted-foreground text-pretty">
            A short read. By the end you&apos;ll know how to log a useful
            prediction, what your calibration score means, and why it gets
            interesting after about thirty entries.
          </p>
        </header>

        <Section id="what" title="What it is">
          <p>
            Hintsight is a journal for predictions you make about your own
            work and life. You log a sentence — what you think will happen and
            how confident you are. Hintsight stores it. On the date you said
            you&apos;d know by, it shows the prediction back and asks: did it
            happen? Yes or no.
          </p>
          <p>
            Over months, the difference between how confident you said you
            were and how often you were right becomes a trackable score. That
            score is called <strong className="text-foreground">calibration</strong>
            , and it&apos;s the entire point of the product.
          </p>
        </Section>

        <Section id="loop" title="The four-step loop">
          <ol className="space-y-5 list-none counter-reset-step">
            <Step n="01" title="Log a prediction">
              Quick log. One sentence. Set your confidence (a number from 0
              to 100), pick the date you&apos;ll know by. Default is 30 days
              out. AI fills in any blanks if you skip the category.
            </Step>
            <Step n="02" title="Forget about it">
              No streaks. No notifications. Hintsight holds the prediction
              quietly. You go live your life.
            </Step>
            <Step n="03" title="Reckon with the outcome">
              On the check-in date the prediction lands in{" "}
              <Code>/reviews</Code>. Mark it{" "}
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                Right
              </span>
              ,{" "}
              <span className="text-rose-700 dark:text-rose-300 font-medium">
                Wrong
              </span>
              , or <em>Unclear</em> if reality didn&apos;t resolve the
              question. Add a one-line note about what really happened.
            </Step>
            <Step n="04" title="See the pattern">
              After 5 reviewed predictions the headline calibration unlocks.
              At 20+ the per-category breakdown becomes meaningful. You
              learn where your gut is sharp and where it drifts.
            </Step>
          </ol>
        </Section>

        <Section id="logging" title="Logging a useful prediction">
          <p>
            A prediction is useful if it&apos;s{" "}
            <strong className="text-foreground">
              specific, time-bound, and falsifiable
            </strong>
            . You should be able to look at it months later and say
            unambiguously whether it came true.
          </p>
          <ExampleCompare
            bad="The quarter is going to be tough."
            good="We hit less than 80% of our pipeline target by end of Q2. ~65%."
          />
          <ExampleCompare
            bad="The new hire might work out."
            good="The new senior engineer ships their first feature within 30 days. ~75%."
          />
          <ExampleCompare
            bad="This client could be a problem."
            good="Acme Co. doesn&apos;t renew at end of contract. ~40%."
          />
          <p className="text-sm text-muted-foreground italic">
            If you&apos;re tempted to write &quot;might,&quot; &quot;could,&quot;
            or &quot;tough&quot; — push yourself for a specific outcome and a
            specific date. That&apos;s the discipline the product is really
            selling.
          </p>
        </Section>

        <Section id="confidence" title="Picking a confidence">
          <p>
            Confidence is your subjective probability the prediction comes
            true. The slider is from 0 to 100. Some anchors:
          </p>
          <div className="grid sm:grid-cols-2 gap-2 my-5">
            {[
              ["0–10%", "almost certain it won't"],
              ["20–30%", "unlikely"],
              ["40–49%", "leaning no"],
              ["50%", "coin flip"],
              ["51–60%", "leaning yes"],
              ["70–80%", "likely"],
              ["90–100%", "almost certain it will"],
            ].map(([range, label]) => (
              <div
                key={range}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <span className="font-mono text-foreground">{range}</span>
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <Callout>
            If you find yourself always picking 70%, you&apos;re doing it wrong.
            The point of having a slider is to <em>commit</em> to a number.
            Force yourself off 70% — is this really more likely than that, or
            less?
          </Callout>
        </Section>

        <Section id="calibration" title="What calibration actually means">
          <p>
            Calibration is the gap between how confident you said you were and
            how often you were actually right.
          </p>
          <p>
            A perfectly calibrated forecaster who says &quot;70%&quot; will be
            right ~70% of the time, across many predictions. If you say 70% and
            you&apos;re only right 50% of the time, you&apos;re overconfident.
            If you say 70% and you&apos;re right 90% of the time, you&apos;re
            underconfident — your gut is sharper than you give it credit for.
          </p>
          <p>
            On the dashboard, the calibration chart plots your stated
            confidence (x-axis) against the share of predictions in that bin
            that came true (y-axis). The diagonal is perfect. Above the
            diagonal = you&apos;re cautious; below = you&apos;re overconfident.
          </p>
          <p>
            Most people are quietly overconfident in one specific domain —
            often the one they&apos;re paid to be confident about. That&apos;s
            the discovery the product is really after.
          </p>
        </Section>

        <Section id="memory" title="Memory chat">
          <p>
            <Code>/memory</Code> is a small chat that searches your prediction
            history and answers questions about it. Examples:
          </p>
          <ul className="space-y-1 my-3 text-foreground/85 list-disc list-inside marker:text-muted-foreground">
            <li>&quot;Where am I most overconfident?&quot;</li>
            <li>&quot;Show me high-confidence predictions I got wrong.&quot;</li>
            <li>&quot;How did I do on hiring last quarter?&quot;</li>
            <li>&quot;What did I say about Acme?&quot;</li>
          </ul>
          <p>
            Under the hood: your question is embedded with{" "}
            <Code>bge-small-en-v1.5</Code> and matched against your prediction
            embeddings via pgvector HNSW. The top 6 hits are passed to{" "}
            <Code>llama-3.3-70b-versatile</Code> on Groq, which writes a
            grounded answer with <Code>[#n]</Code> citations to your own
            words.
          </p>
          <p className="text-sm text-muted-foreground italic">
            It cannot make claims that aren&apos;t in your history. If the
            citations don&apos;t support the answer, it&apos;ll say so.
          </p>
        </Section>

        <Section id="privacy" title="Privacy & data">
          <p>
            Your predictions are private to your account. Row-level security
            in Supabase scopes every read and write to your Clerk user ID — no
            other user (or admin) can read them via the app.
          </p>
          <p>
            AI calls (extraction + memory chat) send the relevant text to Groq
            and Hugging Face for the duration of the request. Neither
            provider is configured to use your data for training; both are
            stateless inference. We don&apos;t log or persist anything beyond
            what&apos;s in your own database.
          </p>
          <p>
            You can export every prediction as JSON or delete your account
            entirely from <Link href="/settings" className="underline underline-offset-4">/settings</Link>.
          </p>
        </Section>

        <Section id="faq" title="FAQ">
          <Faq q="How many predictions before this is useful?">
            The headline calibration number unlocks at 5 reviewed predictions.
            Per-category accuracy needs 5 per category. The interesting
            patterns emerge around 20–30 reviewed entries — usually 4–8 weeks
            of casual logging.
          </Faq>
          <Faq q="What if my prediction is genuinely unclear when the date arrives?">
            Mark it Unclear. Unclear outcomes are excluded from your
            calibration score — they don&apos;t count for or against you.
          </Faq>
          <Faq q="Can I edit a prediction after I log it?">
            No. Editing the prediction text after the fact would defeat the
            point — Hintsight is a record of what you actually said, not what
            you wish you&apos;d said. You can add a note when you mark the
            outcome.
          </Faq>
          <Faq q="What about predictions that span months or years?">
            Those work great — set a check-in date that far out. Hintsight is
            built for slow loops. You&apos;ll get a reminder on the day, not
            before.
          </Faq>
          <Faq q="Is there a mobile app?">
            Not yet. The web app works on mobile (the bottom nav adapts), and
            because logging is just one sentence, mobile is fine. A native
            app might come if there&apos;s real demand.
          </Faq>
          <Faq q="What's the difference between this and a journal?">
            A journal records what you thought. Hintsight forces you to commit
            to a number — and then audits the number against reality. A
            journal makes you feel thoughtful; Hintsight tells you whether you
            actually were.
          </Faq>
        </Section>

        <div className="mt-16 pt-10 border-t border-border">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            Ready to try it?
          </h3>
          <p className="mt-2 text-muted-foreground">
            Free, forever. Setup takes 30 seconds.
          </p>
          <div className="mt-5 flex gap-3">
            <Button
              render={<Link href="/sign-up" />}
              nativeButton={false}
              size="lg"
              className="h-11 px-6"
            >
              Start tracking
              <ArrowRightIcon />
            </Button>
            <Button
              render={<Link href="/" />}
              nativeButton={false}
              variant="ghost"
              size="lg"
              className="h-11 px-6"
            >
              Back to home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 mb-16">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-5">
        {title}
      </h2>
      <div className="space-y-4 text-foreground/85 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-[60px_1fr] gap-4 items-start">
      <div className="text-xs font-mono text-brand pt-1.5">{n}</div>
      <div className="border-l-2 border-border pl-5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-foreground/85">{children}</p>
      </div>
    </li>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-foreground/[0.06] text-foreground/90">
      {children}
    </code>
  );
}

function ExampleCompare({ bad, good }: { bad: string; good: string }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 my-4">
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4">
        <Badge variant="danger" className="mb-2">vague</Badge>
        <p className="text-sm text-foreground/85 leading-snug">{bad}</p>
      </div>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
        <Badge variant="success" className="mb-2">specific</Badge>
        <p className="text-sm text-foreground/85 leading-snug">{good}</p>
      </div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-5 rounded-xl border-l-4 border-brand bg-brand/[0.06] px-5 py-4">
      <p className="text-sm text-foreground/90 leading-relaxed">{children}</p>
    </aside>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-border bg-card px-5 py-4 mb-3 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
        <span className="font-medium text-foreground">{q}</span>
        <span className="text-muted-foreground group-open:rotate-45 transition-transform text-lg leading-none">
          +
        </span>
      </summary>
      <div className="mt-3 text-sm text-foreground/85 leading-relaxed">
        {children}
      </div>
    </details>
  );
}
