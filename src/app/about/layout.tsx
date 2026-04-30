import Link from "next/link";
import { Show } from "@clerk/nextjs";

import { Wordmark } from "@/components/brand/logo";
import { Footer } from "@/components/brand/footer";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { PublicNavLink } from "@/components/app/public-nav-link";
import { PublicMobileNav } from "@/components/app/public-mobile-nav";
import { PublicAuthMenuButtons } from "@/components/app/public-auth-menu-buttons";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
];

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 bg-background">
      <header className="w-full border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" aria-label="Hintsight home">
            <Wordmark />
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <PublicNavLink href="/">Home</PublicNavLink>
            <PublicNavLink href="/docs">Docs</PublicNavLink>
            <PublicNavLink href="/changelog">Changelog</PublicNavLink>
            <PublicNavLink href="/about">About</PublicNavLink>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Show when="signed-out">
              <Button
                render={<Link href="/sign-in" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                Sign in
              </Button>
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                size="sm"
                className="hidden md:inline-flex"
              >
                Get started
              </Button>
            </Show>
            <Show when="signed-in">
              <Button
                render={<Link href="/dashboard" />}
                nativeButton={false}
                size="sm"
                className="hidden md:inline-flex"
              >
                Open app
              </Button>
            </Show>
            <PublicMobileNav
              items={NAV_ITEMS}
              authChildren={<PublicAuthMenuButtons />}
            />
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
