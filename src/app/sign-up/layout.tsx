import Link from "next/link";

import { Wordmark } from "@/components/brand/logo";
import { Footer } from "@/components/brand/footer";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      <main className="relative z-10 flex-1 w-full flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
