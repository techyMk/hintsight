import { cn } from "@/lib/utils";

/**
 * Decorative calibration visual: dotted prediction → solid outcome arc.
 * Used on landing hero and empty-state cards.
 */
export function CalibrationArc({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 300"
      className={cn("w-full h-auto", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="arcGradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="predictedGradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Y-axis grid */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="40"
          x2="560"
          y1={50 + i * 50}
          y2={50 + i * 50}
          stroke="currentColor"
          strokeOpacity={0.06}
          strokeDasharray="2 4"
        />
      ))}

      {/* Predicted line (dotted, lighter) */}
      <path
        d="M 40 200 Q 160 180 240 130 T 400 90 T 560 70"
        stroke="url(#predictedGradient)"
        strokeWidth="2"
        strokeDasharray="4 5"
        strokeLinecap="round"
      />

      {/* Outcome line (solid, gradient) */}
      <path
        d="M 40 220 Q 160 210 240 165 T 400 110 T 560 85"
        stroke="url(#arcGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Outcome dots */}
      {[
        { x: 40, y: 220 },
        { x: 140, y: 205 },
        { x: 240, y: 165 },
        { x: 320, y: 140 },
        { x: 400, y: 110 },
        { x: 480, y: 95 },
      ].map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3}
          fill="currentColor"
          fillOpacity={0.5}
        />
      ))}

      {/* Trailing point in brand color */}
      <circle cx={560} cy={85} r={5} fill="var(--brand)" />
      <circle
        cx={560}
        cy={85}
        r={11}
        stroke="var(--brand)"
        strokeOpacity={0.35}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Axis labels */}
      <text
        x="40"
        y="260"
        fill="currentColor"
        fillOpacity="0.5"
        fontSize="10"
        fontFamily="ui-monospace, monospace"
      >
        WEEK 1
      </text>
      <text
        x="540"
        y="260"
        fill="currentColor"
        fillOpacity="0.5"
        fontSize="10"
        fontFamily="ui-monospace, monospace"
        textAnchor="end"
      >
        WEEK 12
      </text>
      <text
        x="20"
        y="55"
        fill="currentColor"
        fillOpacity="0.5"
        fontSize="10"
        fontFamily="ui-monospace, monospace"
        textAnchor="end"
      >
        100%
      </text>
      <text
        x="20"
        y="255"
        fill="currentColor"
        fillOpacity="0.5"
        fontSize="10"
        fontFamily="ui-monospace, monospace"
        textAnchor="end"
      >
        0%
      </text>
    </svg>
  );
}
