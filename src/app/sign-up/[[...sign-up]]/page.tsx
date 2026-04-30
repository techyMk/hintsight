import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign up — Hintsight",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Free, forever. 30 seconds to set up.
        </p>
      </div>
      <div className="flex justify-center">
        <SignUp
          signInUrl="/sign-in"
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
