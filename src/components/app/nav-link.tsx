"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
  icon,
  badge,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-foreground/[0.06] text-foreground font-medium"
          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-brand" />
      )}
      {icon && (
        <span
          className={cn(
            "shrink-0",
            active
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {badge && <span className="ml-auto">{badge}</span>}
    </Link>
  );
}

export function NavLinkInline({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 rounded-md text-sm transition-colors",
        active
          ? "bg-foreground/[0.06] text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
      )}
    >
      {children}
    </Link>
  );
}
