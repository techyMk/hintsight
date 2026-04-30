import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { QuickLogForm } from "./quick-log-form";

export const metadata = {
  title: "Log a prediction — Hintsight",
};

function defaultCheckInDate() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 30);
  return d.toISOString().slice(0, 10);
}

export default function LogPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"
        >
          ← Back to overview
        </Link>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Log a prediction
        </h1>
        <p className="mt-2 text-muted-foreground text-pretty">
          Write down what you think will happen and when you&apos;ll know. One
          sentence is plenty.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <QuickLogForm defaultCheckInDate={defaultCheckInDate()} />
      </div>

      <Examples />
    </div>
  );
}

function Examples() {
  const examples = [
    {
      tag: "deals",
      text: "This client signs the contract by Friday. ~70%.",
    },
    {
      tag: "hiring",
      text: "The new engineer ships their first feature within 30 days. 60%.",
    },
    {
      tag: "product",
      text: "Conversion on the new pricing page beats the old one. 55%.",
    },
    {
      tag: "personal",
      text: "I keep my morning workout streak through the month. 40%.",
    },
  ];
  return (
    <div className="mt-10">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Examples
      </p>
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        {examples.map((e) => (
          <div
            key={e.text}
            className="rounded-xl border border-border bg-background/60 p-4"
          >
            <Badge variant="muted" className="mb-2">
              {e.tag}
            </Badge>
            <p className="text-sm text-foreground/85 leading-snug">{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
