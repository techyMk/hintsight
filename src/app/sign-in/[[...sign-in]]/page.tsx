import { SignIn, Show } from "@clerk/nextjs";

import { AlreadySignedIn } from "@/components/brand/already-signed-in";

export const metadata = {
  title: "Sign in — Hintsight",
};

export default function Page() {
  return (
    <>
      <Show when="signed-in">
        <AlreadySignedIn />
      </Show>
      <Show when="signed-out">
        <SignIn
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-card border border-border shadow-[0_8px_40px_-16px_rgba(0,0,0,0.18)] rounded-2xl px-6 py-8",
              header: "items-start text-left",
              headerTitle:
                "text-2xl font-semibold tracking-tight text-foreground",
              headerSubtitle: "text-sm text-muted-foreground mt-1",
              socialButtonsBlockButton:
                "border border-border bg-background hover:bg-muted text-foreground rounded-lg h-10 transition-colors",
              socialButtonsBlockButtonText: "font-medium",
              dividerLine: "bg-border",
              dividerText:
                "text-muted-foreground text-xs uppercase tracking-widest",
              formFieldLabel: "text-foreground text-sm font-medium",
              formFieldInput:
                "bg-background border border-input rounded-lg h-10 px-3 text-foreground focus:border-ring focus:ring-3 focus:ring-ring/40 outline-none transition-colors",
              formButtonPrimary:
                "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-10 font-medium normal-case transition-colors",
              footer: "bg-transparent border-0 mt-2",
              footerAction: "text-sm text-muted-foreground",
              footerActionLink:
                "text-foreground hover:text-foreground/80 font-medium",
              identityPreviewText: "text-foreground",
              formFieldAction:
                "text-foreground hover:text-foreground/80 text-sm",
            },
            variables: {
              colorPrimary: "oklch(0.22 0.02 270)",
              borderRadius: "0.6rem",
            },
          }}
        />
      </Show>
    </>
  );
}
