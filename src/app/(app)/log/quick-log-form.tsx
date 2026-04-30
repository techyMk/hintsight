"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { SparkleIcon } from "@/components/app/icons";

import { logPrediction, type LogPredictionState } from "./actions";
import { suggestExtraction } from "./suggest";

const initialState: LogPredictionState = {};

const MAX = 4000;

const CATEGORY_SUGGESTIONS = [
  "deals",
  "hiring",
  "product",
  "finance",
  "personal",
  "other",
];

function confidenceLabel(c: number) {
  if (c <= 10) return "almost certain it won't";
  if (c <= 30) return "unlikely";
  if (c < 50) return "leaning no";
  if (c === 50) return "coin flip";
  if (c <= 70) return "leaning yes";
  if (c <= 90) return "likely";
  return "almost certain it will";
}

type Suggested = {
  category: string | null;
  confidence: number | null;
  due_date: string | null;
};

export function QuickLogForm({
  defaultCheckInDate,
}: {
  defaultCheckInDate: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    logPrediction,
    initialState
  );
  const [confidence, setConfidence] = useState(70);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [checkInDate, setCheckInDate] = useState(defaultCheckInDate);

  useEffect(() => {
    if (state.ok) {
      toast.success("Prediction logged.", {
        description: `You'll see it again on ${new Date(
          checkInDate
        ).toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}.`,
      });
      router.push("/dashboard");
    }
  }, [state.ok, checkInDate, router]);

  const [suggesting, startSuggest] = useTransition();
  const [suggestion, setSuggestion] = useState<Suggested | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const remaining = useMemo(() => MAX - text.length, [text]);
  const canSuggest = text.trim().length >= 8 && !suggesting;

  function runSuggest() {
    setSuggestError(null);
    setApplied(false);
    startSuggest(async () => {
      const result = await suggestExtraction(text);
      if (!result.ok) {
        setSuggestError(result.error);
        setSuggestion(null);
        return;
      }
      setSuggestion({
        category: result.extraction.category,
        confidence: result.extraction.confidence,
        due_date: result.extraction.due_date,
      });
    });
  }

  function applySuggestion() {
    if (!suggestion) return;
    if (suggestion.category) setCategory(suggestion.category);
    if (suggestion.confidence !== null) setConfidence(suggestion.confidence);
    if (suggestion.due_date) setCheckInDate(suggestion.due_date);
    setApplied(true);
  }

  function applyStarter(starter: {
    text: string;
    confidence: number;
    category: string;
  }) {
    setText(starter.text);
    setConfidence(starter.confidence);
    setCategory(starter.category);
    setSuggestion(null);
    setApplied(false);
  }

  return (
    <form action={formAction} className="space-y-7">
      {text.length === 0 && <StarterPack onPick={applyStarter} />}

      {/* Prediction text */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="text" className="text-sm font-medium">
            Your prediction
          </Label>
          <span
            className={`text-xs font-mono tabular-nums ${
              remaining < 100 ? "text-amber-600" : "text-muted-foreground"
            }`}
          >
            {text.length}/{MAX}
          </span>
        </div>
        <Textarea
          id="text"
          name="text"
          required
          minLength={3}
          maxLength={MAX}
          autoFocus
          placeholder="e.g. This client will sign by Friday. ~70% confident."
          className="min-h-32 text-base leading-relaxed resize-none"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (suggestion) setSuggestion(null);
            if (applied) setApplied(false);
          }}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            One sentence is plenty. You&apos;ll see it again on the check-in date.
          </p>
          <button
            type="button"
            onClick={runSuggest}
            disabled={!canSuggest}
            className="text-xs font-medium text-foreground hover:text-foreground/80 disabled:text-muted-foreground/60 disabled:cursor-not-allowed inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 hover:bg-muted transition-colors"
          >
            <SparkleIcon className="size-3" />
            {suggesting ? "Reading…" : "AI suggest"}
          </button>
        </div>
      </div>

      {/* Suggestion preview */}
      {(suggestion || suggestError) && (
        <div className="rounded-xl border border-brand/40 bg-brand-soft/40 p-4 space-y-3">
          {suggestion ? (
            <>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/80">
                <SparkleIcon className="size-3 text-brand" />
                {applied ? "Applied below" : "AI extracted"}
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill
                  label="category"
                  value={suggestion.category ?? "—"}
                  empty={!suggestion.category}
                />
                <Pill
                  label="confidence"
                  value={
                    suggestion.confidence !== null
                      ? `${suggestion.confidence}%`
                      : "—"
                  }
                  empty={suggestion.confidence === null}
                />
                <Pill
                  label="check in"
                  value={suggestion.due_date ?? "—"}
                  empty={!suggestion.due_date}
                />
              </div>
              {!applied && (
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="text-xs font-medium text-foreground hover:underline underline-offset-4"
                >
                  Apply to form →
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-foreground/80">{suggestError}</p>
          )}
        </div>
      )}

      {/* Confidence */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="confidence" className="text-sm font-medium">
            Confidence
          </Label>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums">
              {confidence}
              <span className="text-base text-muted-foreground">%</span>
            </span>
            <span className="text-xs text-muted-foreground italic">
              {confidenceLabel(confidence)}
            </span>
          </div>
        </div>
        <div className="relative">
          <input
            id="confidence"
            name="confidence"
            type="range"
            min={0}
            max={100}
            step={5}
            value={confidence}
            onChange={(e) =>
              setConfidence(Number.parseInt(e.target.value, 10))
            }
            className="w-full accent-foreground"
            style={
              {
                background: `linear-gradient(to right, var(--foreground) 0%, var(--foreground) ${confidence}%, var(--input) ${confidence}%, var(--input) 100%)`,
                height: "4px",
                borderRadius: "4px",
                appearance: "none",
                outline: "none",
              } as React.CSSProperties
            }
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Date + category */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="check_in_date" className="text-sm font-medium">
            Check in on
          </Label>
          <DatePicker
            id="check_in_date"
            name="check_in_date"
            value={checkInDate}
            onChange={setCheckInDate}
            minDate={new Date().toISOString().slice(0, 10)}
          />
          <p className="text-xs text-muted-foreground">
            Default 30 days. You&apos;ll be reminded then.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category{" "}
            <span className="text-muted-foreground font-normal">
              (optional · AI will infer if blank)
            </span>
          </Label>
          <Input
            id="category"
            name="category"
            type="text"
            maxLength={64}
            placeholder="e.g. deals"
            className="h-10"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {CATEGORY_SUGGESTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                  category === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
        >
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <Button
          type="submit"
          disabled={pending || text.trim().length < 3}
          size="lg"
          className="h-11 px-6"
        >
          {pending ? "Saving…" : "Log prediction"}
        </Button>
        <Button
          render={<Link href="/dashboard" />}
          nativeButton={false}
          variant="ghost"
          size="lg"
          className="h-11 px-4"
        >
          Cancel
        </Button>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
          <span className="size-1.5 rounded-full bg-brand" />
          AI fills blanks on save
        </span>
      </div>
    </form>
  );
}

function Pill({
  label,
  value,
  empty,
}: {
  label: string;
  value: string;
  empty?: boolean;
}) {
  return (
    <Badge variant={empty ? "muted" : "default"} className="font-mono">
      <span className="text-muted-foreground/80">{label}:</span>
      <span className={empty ? "text-muted-foreground" : "text-foreground"}>
        {value}
      </span>
    </Badge>
  );
}

const STARTERS: {
  text: string;
  confidence: number;
  category: string;
}[] = [
  {
    text: "This client signs the contract by Friday.",
    confidence: 70,
    category: "deals",
  },
  {
    text: "The new hire ships their first feature within 30 days.",
    confidence: 75,
    category: "hiring",
  },
  {
    text: "We close the seed round before the end of next month.",
    confidence: 60,
    category: "finance",
  },
  {
    text: "I keep my morning workout streak through the month.",
    confidence: 45,
    category: "personal",
  },
  {
    text: "The redesign ships before quarter-end.",
    confidence: 55,
    category: "product",
  },
];

function StarterPack({
  onPick,
}: {
  onPick: (starter: { text: string; confidence: number; category: string }) => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 -mt-2">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
        Or start from a template
      </p>
      <div className="flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button
            key={s.text}
            type="button"
            onClick={() => onPick(s)}
            className="group text-left rounded-lg border border-border bg-background hover:border-foreground/30 hover:bg-card transition-colors px-3 py-2 max-w-full"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Badge variant="muted" className="text-[10px]">
                {s.category}
              </Badge>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                {s.confidence}%
              </span>
            </div>
            <p className="text-xs text-foreground/85 leading-snug line-clamp-1 group-hover:text-foreground">
              {s.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
