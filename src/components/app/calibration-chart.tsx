"use client";

import {
  ComposedChart,
  Line,
  Scatter,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { Bin } from "@/lib/calibration";

type ChartPoint = Bin & { perfect: number };

/**
 * Calibration plot. X = stated confidence (bin midpoint).
 * Y = observed accuracy in that bin. The diagonal is perfect calibration.
 */
export function CalibrationChart({
  bins,
  className,
}: {
  bins: Bin[];
  className?: string;
}) {
  const data: ChartPoint[] = bins.map((b) => ({ ...b, perfect: b.predicted }));

  const hasData = data.length > 0;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart
          data={hasData ? data : placeholderData}
          margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
        >
          <defs>
            <linearGradient id="cal-gradient" x1="0" x2="1" y1="0" y2="0">
              <stop
                offset="0%"
                stopColor="oklch(0.5 0.01 270)"
                stopOpacity={0.3}
              />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="oklch(0.5 0.01 270)"
            strokeOpacity={0.1}
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="predicted"
            type="number"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
            stroke="oklch(0.5 0.01 270)"
            strokeOpacity={0.4}
            tick={{
              fill: "oklch(0.5 0.01 270)",
              fontSize: 10,
              fontFamily: "ui-monospace, monospace",
            }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="number"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
            stroke="oklch(0.5 0.01 270)"
            strokeOpacity={0.4}
            tick={{
              fill: "oklch(0.5 0.01 270)",
              fontSize: 10,
              fontFamily: "ui-monospace, monospace",
            }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: 100, y: 100 },
            ]}
            stroke="oklch(0.5 0.01 270)"
            strokeOpacity={0.3}
            strokeDasharray="3 3"
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              fontSize: "12px",
              fontFamily: "ui-monospace, monospace",
            }}
            labelFormatter={(v) => `Stated: ${v}%`}
            formatter={(value, name) => {
              const n = typeof value === "number" ? value : Number(value);
              if (!Number.isFinite(n)) return ["—", String(name)];
              if (name === "observed")
                return [`${Math.round(n)}%`, "observed"];
              if (name === "perfect") return [`${n}%`, "perfect"];
              return [String(n), String(name)];
            }}
          />
          {hasData && (
            <Line
              type="monotone"
              dataKey="observed"
              stroke="url(#cal-gradient)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "var(--brand)", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "var(--brand)", strokeWidth: 0 }}
              isAnimationActive={false}
            />
          )}
          {!hasData && (
            <Scatter
              dataKey="observed"
              fill="oklch(0.5 0.01 270)"
              opacity={0.2}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const placeholderData: ChartPoint[] = [
  { predicted: 15, observed: 0, n: 0, perfect: 15 },
  { predicted: 35, observed: 0, n: 0, perfect: 35 },
  { predicted: 55, observed: 0, n: 0, perfect: 55 },
  { predicted: 75, observed: 0, n: 0, perfect: 75 },
  { predicted: 95, observed: 0, n: 0, perfect: 95 },
];
