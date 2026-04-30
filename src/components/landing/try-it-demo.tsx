"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightIcon, SparkleIcon } from "@/components/app/icons";

const STORAGE_KEY = "hintsight:demo-prediction";

type SavedDemo = {
  text: string;
  confidence: number;
  checkInDate: string;
  savedAt: string;
};

function defaultCheckInDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function confidenceLabel(c: number) {
  if (c <= 20) return "unlikely";
  if (c < 50) return "leaning no";
  if (c === 50) return "coin flip";
  if (c <= 70) return "leaning yes";
  if (c <= 90) return "likely";
  return "near certain";
}

export function TryItDemo() {
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState(70);
  const [checkInDate, setCheckInDate] = useState(defaultCheckInDate());
  const [saved, setSaved] = useState<SavedDemo | null>(null);

  useEffect(() => {
    // Loading persisted state on mount is the canonical exception to
    // "no setState in effect" — there is no other place to do this safely
    // for client-only storage like localStorage.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSaved(JSON.parse(raw) as SavedDemo);
      }
    } catch {
      // ignore
    }
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 5) return;
    const record: SavedDemo = {
      text: text.trim(),
      confidence,
      checkInDate,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // ignore
    }
    setSaved(record);
  }

  function handleReset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSaved(null);
    setText("");
    setConfidence(70);
    setCheckInDate(defaultCheckInDate());
  }

  if (saved) {
    return <SavedConfirmation saved={saved} onReset={handleReset} />;
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.18)] space-y-5"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="demo-text"
            className="text-sm font-medium text-foreground"
          >
            What do you think will happen?
          </label>
          <Badge variant="muted" className="font-mono">
            <SparkleIcon className="size-3" />
            Try it · No signup
          </Badge>
        </div>
        <Textarea
          id="demo-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. I'll finish the proposal by Friday."
          maxLength={400}
          className="min-h-24 text-base leading-relaxed resize-none"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="demo-confidence"
            className="text-sm font-medium text-foreground"
          >
            How confident are you?
          </label>
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
        <input
          id="demo-confidence"
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
              background: `linear-gradient(to right, oklch(0.22 0.02 270) 0%, oklch(0.22 0.02 270) ${confidence}%, oklch(0.92 0.005 250) ${confidence}%, oklch(0.92 0.005 250) 100%)`,
              height: "4px",
              borderRadius: "4px",
              appearance: "none",
              outline: "none",
            } as React.CSSProperties
          }
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <label
            htmlFor="demo-date"
            className="text-sm font-medium text-foreground"
          >
            Check in on
          </label>
          <input
            id="demo-date"
            type="date"
            value={checkInDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-ring focus:ring-3 focus:ring-ring/40 outline-none transition-colors"
          />
        </div>
        <Button
          type="submit"
          disabled={text.trim().length < 5}
          className="h-11 w-full sm:w-auto sm:justify-self-end px-6"
        >
          Save this prediction
          <ArrowRightIcon />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground/80 text-center pt-1">
        Stored only in your browser — nothing leaves this page.
      </p>
    </form>
  );
}

function SavedConfirmation({
  saved,
  onReset,
}: {
  saved: SavedDemo;
  onReset: () => void;
}) {
  const checkInDateFmt = new Date(saved.checkInDate).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
  // Days from when they hit save to the check-in date — both stable inputs,
  // so this stays pure across renders.
  const daysAway = useMemo(() => {
    const checkIn = new Date(saved.checkInDate).getTime();
    const savedAt = new Date(saved.savedAt).getTime();
    return Math.max(1, Math.round((checkIn - savedAt) / (1000 * 60 * 60 * 24)));
  }, [saved.checkInDate, saved.savedAt]);

  return (
    <div className="rounded-2xl border border-brand/30 bg-brand-soft/40 p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/80">
        <span className="size-2 rounded-full bg-brand" />
        Locked in · stored on this device
      </div>

      <div className="space-y-3">
        <p className="text-xl text-foreground leading-snug text-pretty">
          “{saved.text}”
        </p>
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <Badge variant="default" className="font-mono">
            {saved.confidence}% confident
          </Badge>
          <Badge variant="default" className="font-mono">
            checking in {checkInDateFmt}
          </Badge>
          <span className="text-muted-foreground">
            ({daysAway} day{daysAway === 1 ? "" : "s"} away)
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-5">
        <p className="text-sm text-foreground/85 leading-relaxed">
          That&apos;s the loop. In{" "}
          <span className="text-foreground font-medium">{daysAway} days</span>,
          you&apos;ll be asked: did it happen? Mark it{" "}
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">
            right
          </span>{" "}
          or{" "}
          <span className="text-rose-700 dark:text-rose-300 font-medium">
            wrong
          </span>
          . Repeat 30 times. See whether your gut is actually reliable.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <Button
            render={<Link href="/sign-up" />}
            nativeButton={false}
            className="h-11 px-6"
          >
            Save this for real
            <ArrowRightIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="h-11 px-4"
          >
            Try another
          </Button>
        </div>
      </div>
    </div>
  );
}
