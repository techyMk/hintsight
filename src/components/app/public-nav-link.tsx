"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Top-of-page nav link for marketing/docs pages. Highlights itself when
 * the current pathname matches `href`. Anchor links (e.g. `#try-it`) are
 * never marked active — they're intra-page jumps, not destinations.
 */
export function PublicNavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isAnchor = href.startsWith("#") || href.includes("/#");
  const active =
    !isAnchor &&
    (href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative px-3 py-2 text-sm transition-colors",
        active
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
      {active && (
        <span className="absolute left-3 right-3 -bottom-px h-px bg-brand" />
      )}
    </Link>
  );
}
