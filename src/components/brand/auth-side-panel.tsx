import Link from "next/link";

import { Wordmark } from "./logo";
import { CalibrationArc } from "./calibration-arc";

/**
 * Shared brand panel used by /sign-in and /sign-up.
 * Hidden on mobile — the mobile auth screen is form-only with a small
 * wordmark above. Identical content for both routes by design — the
 * page-level form is the only thing that should differ.
 */
export function AuthSidePanel() {
  return (
    <aside className="relative hidden lg:flex flex-col justify-between p-10 bg-foreground text-background overflow-hidden">
      <div
        className="absolute inset-0 dot-bg opacity-20 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-brand/15 blur-3xl pointer-events-none"
        aria-hidden
      />

      <Link href="/" className="relative z-10 w-fit">
        <Wordmark className="text-background" />
      </Link>

      <div className="relative z-10 max-w-md space-y-10">
        <h2 className="text-4xl font-semibold tracking-tight leading-[1.05] text-balance">
          Predict today.
          <br />
          <span className="italic font-serif font-normal text-brand">
            Find out if you were right.
          </span>
        </h2>

        <div className="space-y-3">
          <div className="text-background/85">
            <CalibrationArc className="text-background" />
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-background/50">
            Your judgment, measured over time.
          </p>
        </div>
      </div>

      <p className="relative z-10 text-xs text-background/40 font-mono">
        © {new Date().getFullYear()} Hintsight
      </p>
    </aside>
  );
}
