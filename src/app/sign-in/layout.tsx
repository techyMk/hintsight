import Link from "next/link";

import { Wordmark } from "@/components/brand/logo";
import { AuthSidePanel } from "@/components/brand/auth-side-panel";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-2 flex-1 min-h-screen w-full">
      <AuthSidePanel />
      <main className="relative flex flex-col items-center px-6 py-10 sm:py-16 bg-background">
        <Link
          href="/"
          className="lg:hidden mb-10"
          aria-label="Hintsight home"
        >
          <Wordmark />
        </Link>
        <div className="w-full max-w-md flex flex-col items-center my-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
