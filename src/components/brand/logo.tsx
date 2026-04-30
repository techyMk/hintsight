import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      aria-hidden
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        className="fill-foreground"
      />
      <path
        d="M9 20.5C9 20.5 11.6 14 16 14C20.4 14 23 20.5 23 20.5"
        className="stroke-background"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="16"
        cy="14"
        r="2"
        className="fill-background"
      />
      <circle
        cx="9"
        cy="20.5"
        r="1.5"
        className="fill-background opacity-60"
      />
      <circle
        cx="23"
        cy="20.5"
        r="1.5"
        className="fill-background opacity-60"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <LogoMark size={22} />
      <span>Hintsight</span>
    </span>
  );
}
