import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Sign in — Hintsight",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue tracking your judgment.
        </p>
      </div>
      <div className="flex justify-center">
        <SignIn
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "oklch(0.22 0.02 270)",
              borderRadius: "0.6rem",
              fontFamily: "var(--font-geist-sans)",
            },
          }}
        />
      </div>
    </div>
  );
}
