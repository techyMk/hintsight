import { clerkSetup } from "@clerk/testing/playwright";
import type { FullConfig } from "@playwright/test";

/**
 * Initialises a Clerk testing token so authed tests can sign in via
 * @clerk/testing's helpers without going through the real OAuth/email flow.
 *
 * Skipped silently if the required env vars aren't set — that case is
 * handled by skipping the authed spec in tests/e2e/authed.spec.ts.
 */
export default async function globalSetup(_config: FullConfig) {
  if (
    !process.env.CLERK_SECRET_KEY ||
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.E2E_CLERK_USER_EMAIL ||
    !process.env.E2E_CLERK_USER_PASSWORD
  ) {
    return;
  }
  await clerkSetup();
}
