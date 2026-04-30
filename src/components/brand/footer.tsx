import Link from "next/link";

import { Wordmark } from "./logo";

export function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-border/60 mt-auto bg-background">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <Wordmark className="text-foreground" />
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            A scoreboard for your judgment.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 text-sm">
          <Link
            href="/#how"
            className="text-muted-foreground hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="/docs"
            className="text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
          <a
            href="https://github.com/techyMk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
        </div>
        <p className="text-xs text-muted-foreground/70 font-mono">
          © {new Date().getFullYear()} Hintsight · Built by{" "}
          <a
            href="https://techymk.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand underline underline-offset-4 decoration-brand/40 decoration-1 hover:decoration-brand transition-colors"
          >
            techyMk ↗
          </a>
        </p>
      </div>
    </footer>
  );
}
