"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  deleteAllPredictions,
  getAllPredictionsForExport,
  type ExportRow,
} from "./actions";

function downloadJson(rows: ExportRow[]) {
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hintsight-export-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadCsv(rows: ExportRow[]) {
  const headers = [
    "id",
    "created_at",
    "text",
    "category",
    "confidence",
    "status",
    "check_in_date",
    "resolved_at",
    "outcome_text",
  ];
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.id,
        r.created_at,
        r.text,
        r.category ?? "",
        r.confidence,
        r.status,
        r.check_in_date,
        r.resolved_at ?? "",
        r.outcome_text ?? "",
      ]
        .map(escape)
        .join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hintsight-export-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportButtons() {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function exportAs(format: "json" | "csv") {
    setFeedback(null);
    startTransition(async () => {
      const result = await getAllPredictionsForExport();
      if (!result.ok) {
        setFeedback(`Couldn't export: ${result.error}`);
        return;
      }
      if (result.rows.length === 0) {
        setFeedback("Nothing to export — log a prediction first.");
        return;
      }
      if (format === "json") downloadJson(result.rows);
      else downloadCsv(result.rows);
      setFeedback(`Exported ${result.rows.length} predictions.`);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportAs("json")}
          disabled={pending}
        >
          {pending ? "…" : "Export JSON"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportAs("csv")}
          disabled={pending}
        >
          Export CSV
        </Button>
      </div>
      {feedback && (
        <p className="text-xs text-muted-foreground">{feedback}</p>
      )}
    </div>
  );
}

export function DeletePredictionsButton() {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);

  if (done !== null) {
    return (
      <p className="text-sm text-muted-foreground">
        Deleted {done} prediction{done === 1 ? "" : "s"}. Reload to see the
        empty state.
      </p>
    );
  }

  if (!confirming) {
    return (
      <Button
        variant="destructive"
        className="h-10 px-4"
        onClick={() => setConfirming(true)}
      >
        Delete predictions…
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
        Are you sure? This wipes every prediction you&apos;ve logged. Cannot
        be undone.
      </p>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          className="h-10 px-4"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const result = await deleteAllPredictions();
              if (result.error) {
                setError(result.error);
                return;
              }
              setDone(result.count ?? 0);
            })
          }
        >
          {pending ? "Deleting…" : "Yes, delete everything"}
        </Button>
        <Button
          variant="ghost"
          className="h-10 px-4"
          onClick={() => setConfirming(false)}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
      {error && <p className="text-xs text-rose-700">{error}</p>}
    </div>
  );
}
