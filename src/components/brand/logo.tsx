import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The square brand mark — used wherever you want just the icon (no
 * wordmark). Sized via the `className` prop, default ~28px square.
 */
export function LogoMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/Hintsight-icon.svg"
      alt="Hintsight"
      width={size}
      height={size}
      priority
      className={cn("inline-block", className)}
    />
  );
}

/**
 * The full wordmark logo (icon + "Hintsight" text). Swaps between light
 * and dark variants automatically based on the active theme. Sized via
 * height (`h-*` Tailwind classes); width auto-derives from the 2:1 aspect
 * ratio of the underlying SVG (810×405).
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center select-none",
        className
      )}
      aria-label="Hintsight"
    >
      <Image
        src="/Hintsight-logo-light.svg"
        alt="Hintsight"
        width={810}
        height={405}
        priority
        className="h-10 w-auto dark:hidden"
      />
      <Image
        src="/Hintsight-logo-dark.svg"
        alt="Hintsight"
        width={810}
        height={405}
        priority
        className="h-10 w-auto hidden dark:block"
      />
    </span>
  );
}
