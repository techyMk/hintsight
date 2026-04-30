"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { submitReview, type Outcome } from "./actions";

type Status = "pending" | "right" | "wrong" | "unclear";

type Prediction = {
  id: string;
  text: string;
  category: string | null;
  confidence: number;
  status: Status;
  check_in_date: string;
  created_at: string;
  outcome_text?: string | null;
};

function daysFrom(target: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const t = new Date(target + "T00:00:00");
  const diff = Math.round(
    (t.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

const outcomeCopy: Record<Exclude<Status, "pending">, string> = {
  right: "right",
  wrong: "wrong",
  unclear: "unclear",
};

const outcomeDot: Record<Exclude<Status, "pending">, string> = {
  right: "bg-emerald-500",
  wrong: "bg-rose-500",
  unclear: "bg-amber-400",
};

export function ReviewCard({ prediction }: { prediction: Prediction }) {
  const isReviewed = prediction.status !== "pending";
  const days = daysFrom(prediction.check_in_date);
  const isDue = !isReviewed && days <= 0;

  const router = useRouter();
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submitOutcome(outcome: Outcome) {
    startTransition(async () => {
      setError(null);
      const result = await submitReview({
        id: prediction.id,
        outcome,
        outcome_text: note.trim() || null,
      });
      if (result.error) {
        setError(result.error);
        toast.error("Couldn't save review", { description: result.error });
        return;
      }
      const copy = {
        right: "Marked right.",
        wrong: "Marked wrong.",
        unclear: "Marked unclear.",
      } as const;
      toast.success(copy[outcome], {
        description: "Calibration updated.",
      });
      router.refresh();
    });
  }

  return (
    <article
      className={`group rounded-2xl border bg-card p-6 transition-all ${
        isDue
          ? "border-amber-400/40 ring-1 ring-amber-400/20"
          : "border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge
            variant={
              isReviewed
                ? prediction.status === "right"
                  ? "success"
                  : prediction.status === "wrong"
                  ? "danger"
                  : "warning"
                : isDue
                ? "warning"
                : "outline"
            }
          >
            {isReviewed
              ? outcomeCopy[prediction.status as Exclude<Status, "pending">]
              : isDue
              ? "due now"
              : `in ${days}d`}
          </Badge>
          {prediction.category && (
            <Badge variant="muted">{prediction.category}</Badge>
          )}
          <Badge variant="muted">{prediction.confidence}% confident</Badge>
          <span className="text-muted-foreground/70 font-mono text-[10px] uppercase tracking-widest">
            logged{" "}
            {new Date(prediction.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Body */}
      <p className="mt-4 text-lg text-foreground leading-snug text-pretty">
        {prediction.text}
      </p>

      {/* Footer */}
      <div className="mt-5 pt-5 border-t border-border">
        {isReviewed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`size-2 rounded-full ${
                  outcomeDot[prediction.status as Exclude<Status, "pending">]
                }`}
              />
              <span className="font-medium text-foreground">
                You marked this{" "}
                {outcomeCopy[prediction.status as Exclude<Status, "pending">]}.
              </span>
            </div>
            {prediction.outcome_text && (
              <p className="text-sm text-muted-foreground italic">
                “{prediction.outcome_text}”
              </p>
            )}
          </div>
        ) : !showNote ? (
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <p className="text-sm text-muted-foreground flex-1">
              {isDue
                ? "What actually happened?"
                : `Check in on ${new Date(
                    prediction.check_in_date
                  ).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}.`}
            </p>
            <div className="flex gap-2">
              <button
                disabled={pending}
                onClick={() => submitOutcome("right")}
                className="flex-1 sm:flex-none h-10 px-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
              >
                {pending ? "…" : "Right"}
              </button>
              <button
                disabled={pending}
                onClick={() => submitOutcome("wrong")}
                className="flex-1 sm:flex-none h-10 px-4 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-sm font-medium hover:bg-rose-500/20 transition-colors disabled:opacity-50"
              >
                Wrong
              </button>
              <button
                onClick={() => setShowNote(true)}
                className="h-10 px-3 rounded-lg border border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                + note
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              placeholder="What really happened? (optional)"
              className="min-h-20 resize-none"
            />
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <button
                type="button"
                onClick={() => submitOutcome("unclear")}
                disabled={pending}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                Mark unclear instead
              </button>
              <div className="flex gap-2">
                <Button
                  onClick={() => submitOutcome("right")}
                  disabled={pending}
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                >
                  Right
                </Button>
                <Button
                  onClick={() => submitOutcome("wrong")}
                  disabled={pending}
                  variant="outline"
                  className="border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20"
                >
                  Wrong
                </Button>
              </div>
            </div>
          </div>
        )}
        {error && (
          <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
