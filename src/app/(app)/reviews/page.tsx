import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/app/icons";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ReviewCard } from "./review-card";

export const metadata = {
  title: "Reviews — Hintsight",
};

type Filter = "due" | "pending" | "reviewed" | "all";

type ReviewRow = {
  id: string;
  text: string;
  category: string | null;
  confidence: number;
  status: "pending" | "right" | "wrong" | "unclear";
  check_in_date: string;
  created_at: string;
  outcome_text?: string | null;
};

async function safeLoad(filter: Filter) {
  try {
    const supabase = createSupabaseServerClient();
    const today = new Date().toISOString().slice(0, 10);

    let query = supabase
      .from("predictions")
      .select(
        "id, text, category, confidence, status, check_in_date, created_at, outcome_text"
      )
      .order("check_in_date", { ascending: true });

    if (filter === "due") {
      query = query.eq("status", "pending").lte("check_in_date", today);
    } else if (filter === "pending") {
      query = query.eq("status", "pending");
    } else if (filter === "reviewed") {
      query = query.neq("status", "pending");
    }

    const { data, error } = await query.limit(100);
    if (error) throw error;

    const counts = await Promise.all([
      supabase
        .from("predictions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .lte("check_in_date", today),
      supabase
        .from("predictions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("predictions")
        .select("*", { count: "exact", head: true })
        .neq("status", "pending"),
      supabase.from("predictions").select("*", { count: "exact", head: true }),
    ]);

    return {
      ok: true as const,
      items: (data ?? []) as ReviewRow[],
      counts: {
        due: counts[0].count ?? 0,
        pending: counts[1].count ?? 0,
        reviewed: counts[2].count ?? 0,
        all: counts[3].count ?? 0,
      },
    };
  } catch {
    return {
      ok: false as const,
      items: [] as ReviewRow[],
      counts: { due: 0, pending: 0, reviewed: 0, all: 0 },
    };
  }
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const sp = await searchParams;
  const filter: Filter =
    sp.filter === "pending" || sp.filter === "reviewed" || sp.filter === "all"
      ? sp.filter
      : "due";

  const { items, counts } = await safeLoad(filter);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          The honest part
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Reviews
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          On the check-in date, mark what really happened. The truth is what
          calibrates the score.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="rounded-xl border border-border bg-card p-1 inline-flex flex-wrap gap-1 text-sm">
        <FilterTab value="due" current={filter} count={counts.due}>
          Due now
        </FilterTab>
        <FilterTab value="pending" current={filter} count={counts.pending}>
          Pending
        </FilterTab>
        <FilterTab value="reviewed" current={filter} count={counts.reviewed}>
          Reviewed
        </FilterTab>
        <FilterTab value="all" current={filter} count={counts.all}>
          All
        </FilterTab>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="grid gap-4">
          {items.map((p) => (
            <ReviewCard key={p.id} prediction={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTab({
  value,
  current,
  count,
  children,
}: {
  value: Filter;
  current: Filter;
  count: number;
  children: React.ReactNode;
}) {
  const active = value === current;
  return (
    <Link
      href={`/reviews?filter=${value}`}
      className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span>{children}</span>
      <span
        className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded ${
          active ? "bg-background/20" : "bg-foreground/[0.06]"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  const messages: Record<Filter, { title: string; body: string; cta?: string }> = {
    due: {
      title: "Nothing to review right now.",
      body: "Predictions show up here on their check-in date. Come back when one is due, or log another.",
      cta: "Log a prediction",
    },
    pending: {
      title: "No pending predictions.",
      body: "Predictions you log appear here while they wait for a check-in date.",
      cta: "Log your first prediction",
    },
    reviewed: {
      title: "No reviewed predictions yet.",
      body: "Once you mark a prediction right or wrong, it lands here as part of your calibration record.",
    },
    all: {
      title: "Nothing logged yet.",
      body: "Once you start logging predictions, they all collect here.",
      cta: "Log your first prediction",
    },
  };
  const m = messages[filter];
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
      <div className="mx-auto size-12 rounded-2xl border border-border bg-background flex items-center justify-center text-muted-foreground">
        <CheckCircleIcon />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
        {m.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
        {m.body}
      </p>
      {m.cta && (
        <Button
          render={<Link href="/log" />}
          nativeButton={false}
          className="mt-5"
        >
          {m.cta}
          <ArrowRightIcon />
        </Button>
      )}
      <div className="mt-3">
        <Badge variant="muted">tip — calibration kicks in after ~20 reviews</Badge>
      </div>
    </div>
  );
}
