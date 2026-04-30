import Link from "next/link";
import { Show } from "@clerk/nextjs";

import { Wordmark } from "@/components/brand/logo";
import { Footer } from "@/components/brand/footer";
import { Button } from "@/components/ui/button";

export default function DocsLayout({
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
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/docs"
              className="px-3 py-2 text-foreground font-medium"
            >
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <Button
                render={<Link href="/sign-in" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                Sign in
              </Button>
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                size="sm"
              >
                Get started
              </Button>
            </Show>
            <Show when="signed-in">
              <Button
                render={<Link href="/dashboard" />}
                nativeButton={false}
                size="sm"
              >
                Open app
              </Button>
            </Show>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
