import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/app/sparkline";
import { CalibrationArc } from "@/components/brand/calibration-arc";
import { CalibrationChart } from "@/components/app/calibration-chart";
import { CategoryChart } from "@/components/app/category-chart";
import {
  PlusIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@/components/app/icons";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  computeCalibration,
  isCalibrationMeaningful,
  CALIBRATION_THRESHOLD,
  type CalibrationResult,
  type CategoryStat,
} from "@/lib/calibration";

export const metadata = {
  title: "Overview — Hintsight",
};

type Status = "pending" | "right" | "wrong" | "unclear";

type PredictionRow = {
  id: string;
  text: string;
  category: string | null;
  confidence: number;
  status: Status;
  check_in_date: string;
  created_at: string;
};

const EMPTY_CALIBRATION: CalibrationResult = {
  totalReviewed: 0,
  accuracy: 0,
  brier: 0,
  averageGap: 0,
  bins: [],
  byCategory: [],
};

async function safeLoad() {
  try {
    const supabase = createSupabaseServerClient();
    const today = new Date().toISOString().slice(0, 10);

    const [
      { count: totalCount },
      { count: pendingCount },
      { count: dueCount },
      { count: reviewedCount },
      { data: recent },
      { data: allReviewed },
    ] = await Promise.all([
      supabase.from("predictions").select("*", { count: "exact", head: true }),
      supabase
        .from("predictions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("predictions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .lte("check_in_date", today),
      supabase
        .from("predictions")
        .select("*", { count: "exact", head: true })
        .neq("status", "pending"),
      supabase
        .from("predictions")
        .select("id, text, category, confidence, status, check_in_date, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("predictions")
        .select("confidence, status, category")
        .neq("status", "pending"),
    ]);

    const calibration = computeCalibration(
      (allReviewed ?? []) as Array<{
        confidence: number;
        status: Status;
        category: string | null;
      }>
    );

    return {
      ok: true as const,
      total: totalCount ?? 0,
      pending: pendingCount ?? 0,
      due: dueCount ?? 0,
      reviewed: reviewedCount ?? 0,
      recent: (recent as PredictionRow[] | null) ?? [],
      calibration,
    };
  } catch {
    return {
      ok: false as const,
      total: 0,
      pending: 0,
      due: 0,
      reviewed: 0,
      recent: [] as PredictionRow[],
      calibration: EMPTY_CALIBRATION,
    };
  }
}

export default async function DashboardPage() {
  const user = await currentUser();
  const greeting = user?.firstName
    ? `Welcome back, ${user.firstName}.`
    : "Welcome.";

  const { total, pending, due, reviewed, recent, calibration } =
    await safeLoad();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {greeting}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            {total === 0
              ? "You haven't logged any predictions yet. Start with one — it takes 30 seconds."
              : due > 0
              ? `${due} prediction${due === 1 ? " is" : "s are"} ready for review.`
              : "Nothing due yet. Log another prediction or come back on a check-in date."}
          </p>
        </div>
        <Button render={<Link href="/log" />} nativeButton={false} size="lg">
          <PlusIcon />
          <span>Log a prediction</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Predictions" value={total} hint="all time" tone="default" />
        <Stat
          label="Pending"
          value={pending}
          hint="awaiting check-in"
          tone="muted"
        />
        <Stat
          label="Due now"
          value={due}
          hint={due > 0 ? "review them →" : "all caught up"}
          tone={due > 0 ? "warning" : "success"}
          href={due > 0 ? "/reviews" : undefined}
        />
        <Stat
          label="Reviewed"
          value={reviewed}
          hint="counted in calibration"
          tone="default"
        />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <CalibrationCard
          calibration={calibration}
          reviewed={reviewed}
          total={total}
        />
        <RecentPredictions items={recent} />
      </div>

      <ByCategoryCard byCategory={calibration.byCategory} />

      {total === 0 && <OnboardingCard />}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
  href,
}: {
  label: string;
  value: number;
  hint: string;
  tone: "default" | "muted" | "warning" | "success";
  href?: string;
}) {
  const toneRing: Record<typeof tone, string> = {
    default: "ring-border",
    muted: "ring-border",
    warning: "ring-amber-400/40",
    success: "ring-emerald-400/40",
  };
  const toneDot: Record<typeof tone, string> = {
    default: "bg-foreground/20",
    muted: "bg-foreground/10",
    warning: "bg-amber-500",
    success: "bg-emerald-500",
  };
  const inner = (
    <div
      className={`group/stat relative rounded-xl bg-card p-4 ring-1 ${toneRing[tone]} transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] ${
        href ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        <span className={`size-1.5 rounded-full ${toneDot[tone]}`} />
        {label}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function CalibrationCard({
  calibration,
  reviewed,
  total,
}: {
  calibration: CalibrationResult;
  reviewed: number;
  total: number;
}) {
  const meaningful = isCalibrationMeaningful(calibration.totalReviewed);
  const headline = meaningful ? Math.round(calibration.accuracy) : null;
  const gap = meaningful ? Math.round(calibration.averageGap) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Calibration
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-5xl font-semibold tracking-tight tabular-nums">
              {headline === null ? "—" : (
                <>
                  {headline}
                  <span className="text-brand">%</span>
                </>
              )}
            </span>
            <Badge variant={meaningful ? "success" : "muted"}>
              {meaningful
                ? `n=${calibration.totalReviewed} · gap ${gap}pp`
                : `${Math.max(
                    0,
                    CALIBRATION_THRESHOLD - calibration.totalReviewed
                  )} more reviews to unlock`}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            {meaningful
              ? "Headline is overall accuracy. Gap is the average distance between your confidence and how often you were right."
              : "Calibration is the gap between how confident you said you were and how often you were actually right. Lower gap = sharper judgment."}
          </p>
        </div>
      </div>

      <div className={`mt-6 ${meaningful ? "" : "opacity-60"}`}>
        {meaningful ? (
          <CalibrationChart bins={calibration.bins} />
        ) : (
          <CalibrationArc className="text-foreground" />
        )}
      </div>
      {meaningful && (
        <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
          x: stated confidence · y: observed accuracy · diagonal = perfect
        </p>
      )}

      {!meaningful && (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/40 p-4">
          <span className="size-8 rounded-full bg-foreground/[0.06] border border-border flex items-center justify-center text-foreground">
            <CheckCircleIcon />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Keep logging. The arc fills in as outcomes come back.
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {total === 0
                ? "Start with your first prediction."
                : `${total} logged · ${reviewed} reviewed.`}
            </p>
          </div>
          <Button
            render={<Link href={total === 0 ? "/log" : "/reviews"} />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            {total === 0 ? "Log first" : "Open reviews"}
            <ArrowRightIcon />
          </Button>
        </div>
      )}
    </div>
  );
}

function RecentPredictions({ items }: { items: PredictionRow[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Recent predictions
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight">
            What you said
          </h3>
        </div>
        <Link
          href="/reviews"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          See all <ArrowRightIcon className="size-3" />
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground italic py-8 text-center">
            Nothing yet. Your last 6 predictions will appear here.
          </div>
        ) : (
          items.map((p) => <PredictionRowItem key={p.id} p={p} />)
        )}
      </div>
    </div>
  );
}

function PredictionRowItem({ p }: { p: PredictionRow }) {
  const dot =
    p.status === "pending"
      ? "bg-amber-400 animate-pulse"
      : p.status === "right"
      ? "bg-emerald-500"
      : p.status === "wrong"
      ? "bg-rose-500"
      : "bg-foreground/30";
  return (
    <div className="group">
      <div className="flex items-center gap-2 text-xs">
        <span className={`size-1.5 rounded-full ${dot}`} />
        <span className="font-mono uppercase tracking-widest text-muted-foreground">
          {p.category ?? "uncategorised"}
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span className="font-mono text-muted-foreground">
          {p.confidence}%
        </span>
        <span className="ml-auto text-muted-foreground/70 font-mono text-[10px]">
          {new Date(p.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <p className="mt-1 text-sm text-foreground line-clamp-2 leading-snug">
        {p.text}
      </p>
    </div>
  );
}

const SAMPLE_BY_CATEGORY: { name: string; trend: number[] }[] = [
  { name: "Hiring", trend: [62, 58, 65, 70, 68, 73, 75, 71, 73, 76, 78, 73] },
  { name: "Deals", trend: [50, 48, 45, 42, 44, 41, 39, 42, 41, 40, 41, 41] },
  { name: "Product", trend: [55, 58, 60, 62, 60, 64, 62, 65, 63, 66, 64, 62] },
  { name: "Personal", trend: [70, 72, 70, 68, 71, 73, 72, 75, 76, 74, 75, 77] },
];

const PER_CATEGORY_THRESHOLD = 5;

function ByCategoryCard({ byCategory }: { byCategory: CategoryStat[] }) {
  const meaningful = byCategory.filter((c) => c.n >= PER_CATEGORY_THRESHOLD);
  const useReal = meaningful.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            By category {useReal ? "" : "· sample"}
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight">
            {useReal
              ? "Where your judgment is sharp, where it drifts"
              : "Where your judgment will land, by category"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            {useReal
              ? `Showing categories with ${PER_CATEGORY_THRESHOLD}+ reviewed predictions.`
              : "Real data appears once each category has 5+ reviewed predictions. Below is illustrative."}
          </p>
        </div>
      </div>
      <div className="mt-5">
        {useReal ? (
          <CategoryChart data={meaningful} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 opacity-70">
            {SAMPLE_BY_CATEGORY.map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-border bg-background p-4 text-foreground/85"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">
                    {c.trend[c.trend.length - 1]}%
                  </span>
                </div>
                <div className="mt-3">
                  <Sparkline values={c.trend} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OnboardingCard() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 sm:p-8">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Get started
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">
        Try it once. The shape of the product will click.
      </h3>
      <p className="mt-2 text-muted-foreground max-w-xl">
        Predict something concrete — a meeting, a deal, a hiring decision. Pick
        a confidence and a date you&apos;ll know by. Hintsight does the rest.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button render={<Link href="/log" />} nativeButton={false}>
          Log your first prediction
        </Button>
        <Button
          render={<Link href="/memory" />}
          nativeButton={false}
          variant="outline"
        >
          See examples
        </Button>
      </div>
    </div>
  );
}
