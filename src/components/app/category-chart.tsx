"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { CategoryStat } from "@/lib/calibration";

export function CategoryChart({
  data,
  className,
}: {
  data: CategoryStat[];
  className?: string;
}) {
  const sorted = [...data]
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 8);

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={Math.max(160, sorted.length * 36)}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 4, right: 36, bottom: 4, left: 0 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            hide
          />
          <YAxis
            type="category"
            dataKey="category"
            width={92}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: string) =>
              typeof v === "string" && v.length > 0
                ? v[0].toUpperCase() + v.slice(1)
                : v
            }
            tick={{
              fill: "oklch(0.5 0.01 270)",
              fontSize: 12,
              fontFamily: "ui-sans-serif, system-ui",
            }}
          />
          <Tooltip
            cursor={{ fill: "oklch(0.5 0.01 270 / 0.06)" }}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              fontSize: "12px",
              fontFamily: "ui-monospace, monospace",
            }}
            formatter={(value, _name, item) => {
              const v = typeof value === "number" ? value : Number(value);
              const payload = (item as { payload?: { n?: number } } | undefined)
                ?.payload;
              const n = payload?.n ?? 0;
              return [
                Number.isFinite(v) ? `${Math.round(v)}% · n=${n}` : "—",
                "accuracy",
              ];
            }}
          />
          <Bar
            dataKey="accuracy"
            radius={[0, 6, 6, 0]}
            barSize={18}
            isAnimationActive={false}
            label={{
              position: "right",
              fill: "var(--foreground)",
              fontSize: 11,
              fontFamily: "ui-monospace, monospace",
              formatter: (v: unknown) =>
                typeof v === "number" ? `${Math.round(v)}%` : "",
            }}
          >
            {sorted.map((d) => {
              // Tint by accuracy: rose < 50, amber 50-70, emerald > 70
              const fill =
                d.accuracy >= 70
                  ? "oklch(0.65 0.16 150)"
                  : d.accuracy >= 50
                  ? "oklch(0.7 0.16 80)"
                  : "oklch(0.6 0.22 25)";
              return <Cell key={d.category} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
