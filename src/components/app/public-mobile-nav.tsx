"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type MobileNavItem = { href: string; label: string };

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}

function isLinkActive(href: string, pathname: string) {
  if (href.startsWith("#") || href.includes("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Slide-down mobile nav for public pages. Hidden on md+ where the inline
 * desktop nav handles things. Closes on:
 *   - link click (intra-page anchors and route changes)
 *   - pathname change
 *   - escape key
 *   - body scroll-lock while open prevents background scrolling
 */
export function PublicMobileNav({
  items,
  authChildren,
}: {
  items: MobileNavItem[];
  authChildren?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change. Synchronising UI state to a router signal is a
  // legitimate setState-in-effect use; there's no other hook for "pathname
  // changed." Setting to false when already false is a React no-op.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Close on Escape, lock background scroll while open
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="md:hidden size-9 rounded-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 top-14 z-20 bg-background/40 backdrop-blur-sm"
          />
          {/* Panel slides down from under the sticky header (h-14 = 56px) */}
          <div
            id="mobile-nav-panel"
            className="md:hidden fixed inset-x-0 top-14 z-30 border-b border-border bg-background shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]"
          >
            <nav className="px-4 py-3 flex flex-col gap-0.5">
              {items.map((item) => {
                const active = isLinkActive(item.href, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-3 py-3 rounded-lg text-base transition-colors flex items-center justify-between gap-3",
                      active
                        ? "bg-foreground/[0.06] text-foreground font-medium"
                        : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                    )}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="size-1.5 rounded-full bg-brand" />
                    )}
                  </Link>
                );
              })}
            </nav>
            {authChildren && (
              <div
                className="px-4 pb-4 pt-3 border-t border-border flex flex-col gap-2"
                onClickCapture={() => setOpen(false)}
              >
                {authChildren}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
