import Link from "next/link";

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
    </div>
  );
}
