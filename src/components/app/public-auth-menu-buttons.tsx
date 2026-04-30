import Link from "next/link";
import { Show } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

/**
 * Sign-in / Sign-up / Open app buttons for the mobile menu's auth section.
 * Used by every public layout that opens the PublicMobileNav.
 */
export function PublicAuthMenuButtons() {
  return (
    <>
      <Show when="signed-out">
        <Button
          render={<Link href="/sign-in" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="h-11 w-full justify-center"
        >
          Sign in
        </Button>
        <Button
          render={<Link href="/sign-up" />}
          nativeButton={false}
          size="lg"
          className="h-11 w-full justify-center"
        >
          Get started
        </Button>
      </Show>
      <Show when="signed-in">
        <Button
          render={<Link href="/dashboard" />}
          nativeButton={false}
          size="lg"
          className="h-11 w-full justify-center"
        >
          Open app
        </Button>
      </Show>
    </>
  );
}
