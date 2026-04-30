import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";

export const metadata = {
  title: "Not found · Hintsight",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      <div
        className="absolute inset-0 dot-bg radial-fade opacity-40 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-brand/10 blur-3xl pointer-events-none"
        aria-hidden
      />

      <header className="relative z-10 w-full">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center">
          <Link href="/" aria-label="Hintsight home">
            <Wordmark />
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            404
          </p>
          <h1 className="mt-3 text-5xl sm:text-6xl font-semibold tracking-tight text-foreground leading-[1] text-balance">
            Off the{" "}
            <span className="italic font-serif font-normal text-brand">
              calibration curve
            </span>
            .
          </h1>
          <p className="mt-5 text-muted-foreground text-pretty">
            The page you predicted would be here didn&apos;t pan out. Mark
            this one wrong and head back to where you know your way around.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              render={<Link href="/" />}
              nativeButton={false}
              size="lg"
              className="h-11 px-6"
            >
              Back to home
            </Button>
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="h-11 px-6"
            >
              Open dashboard
            </Button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full">
        <div className="max-w-md mx-auto px-6 py-6 text-center text-xs text-muted-foreground/70 font-mono">
          © {new Date().getFullYear()} Hintsight
        </div>
      </footer>
    </div>
  );
}
