import { cn } from "@/lib/utils";

export function Sparkline({
  values,
  className,
  showArea = true,
}: {
  values: number[];
  className?: string;
  showArea?: boolean;
}) {
  if (values.length === 0) {
    return (
      <div className={cn("h-12 flex items-end gap-1", className)}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-foreground/[0.06]"
            style={{ height: `${20 + (i * 7) % 30}%` }}
          />
        ))}
      </div>
    );
  }

  const w = 120;
  const h = 36;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = w / (values.length - 1 || 1);

  const pts = values.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * h;
    return { x, y };
  });

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("w-full h-9", className)}
      aria-hidden
    >
      {showArea && (
        <path
          d={areaPath}
          fill="currentColor"
          fillOpacity="0.08"
        />
      )}
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r="2"
        fill="currentColor"
      />
    </svg>
  );
}
