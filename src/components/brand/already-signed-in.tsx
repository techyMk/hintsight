import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/app/icons";

/**
 * Shown on /sign-in or /sign-up when the user is already authenticated.
 * Clerk normally auto-redirects them, but the redirect can stall on OAuth
 * callbacks or slow JS bootstrap — without this fallback the user sees a
 * blank panel.
 */
export function AlreadySignedIn() {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-8 sm:p-10 text-center shadow-[0_8px_40px_-16px_rgba(0,0,0,0.18)]">
      <div className="mx-auto size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
        <span className="size-2.5 rounded-full bg-emerald-500" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        You&apos;re already signed in.
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick up where you left off.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
        <Button
          render={<Link href="/dashboard" />}
          nativeButton={false}
          className="h-10 px-5"
        >
          Open dashboard
          <ArrowRightIcon />
        </Button>
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="ghost"
          className="h-10 px-5"
        >
          Back to home
        </Button>
      </div>
      <p className="mt-6 text-xs text-muted-foreground/70">
        Need to switch accounts? Sign out from the avatar menu first.
      </p>
    </div>
  );
}
