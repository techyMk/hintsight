import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Wordmark } from "@/components/brand/logo";
import { Footer } from "@/components/brand/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/app/nav-link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  HomeIcon,
  PencilIcon,
  CheckCircleIcon,
  SparkleIcon,
  SettingsIcon,
  PlusIcon,
} from "@/components/app/icons";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* Top header */}
      <header className="w-full border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center" aria-label="Hintsight">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-2">
            <Button
              render={<Link href="/log" />}
              nativeButton={false}
              size="sm"
              className="hidden sm:inline-flex"
            >
              <PlusIcon />
              <span>New prediction</span>
            </Button>
            <ThemeToggle />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-8 ring-1 ring-border",
                },
              }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[220px_1fr] gap-6 flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-20 space-y-6">
            <div className="space-y-1">
              <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
                Tracking
              </p>
              <NavLink href="/dashboard" icon={<HomeIcon />}>
                Overview
              </NavLink>
              <NavLink href="/log" icon={<PencilIcon />}>
                Quick log
              </NavLink>
              <NavLink
                href="/reviews"
                icon={<CheckCircleIcon />}
                badge={
                  <Badge variant="warning" className="px-1.5 py-0 text-[10px]">
                    new
                  </Badge>
                }
              >
                Reviews
              </NavLink>
            </div>
            <div className="space-y-1">
              <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
                Insight
              </p>
              <NavLink href="/memory" icon={<SparkleIcon />}>
                Memory
              </NavLink>
              <NavLink href="/settings" icon={<SettingsIcon />}>
                Settings
              </NavLink>
            </div>

            <Link
              href="/docs"
              className="mt-6 mx-2 block rounded-xl border border-border/80 bg-muted/40 p-4 hover:bg-muted/60 transition-colors group"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                New here?
              </p>
              <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
                Read the guide — how to log a useful prediction, what your
                calibration score means.
              </p>
              <span className="mt-2 inline-flex items-center text-xs text-foreground font-medium group-hover:underline underline-offset-4">
                Open docs →
              </span>
            </Link>
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur-md">
          <div className="grid grid-cols-5 px-2 py-1.5">
            <MobileNav href="/dashboard" label="Home">
              <HomeIcon />
            </MobileNav>
            <MobileNav href="/log" label="Log">
              <PencilIcon />
            </MobileNav>
            <MobileNav href="/reviews" label="Reviews">
              <CheckCircleIcon />
            </MobileNav>
            <MobileNav href="/memory" label="Memory">
              <SparkleIcon />
            </MobileNav>
            <MobileNav href="/settings" label="Settings">
              <SettingsIcon />
            </MobileNav>
          </div>
        </div>

        {/* Main content */}
        <main className="min-w-0 pb-24 lg:pb-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

function MobileNav({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-md text-muted-foreground active:text-foreground"
    >
      {children}
      <span className="text-[10px]">{label}</span>
    </Link>
  );
}
