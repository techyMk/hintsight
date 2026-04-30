import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ExportButtons,
  DeletePredictionsButton,
} from "./settings-actions";

export const metadata = {
  title: "Settings — Hintsight",
};

export default async function SettingsPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "—";
  const name = user?.fullName ?? user?.firstName ?? "Anonymous";
  const initials = (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "");
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-7 max-w-3xl">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Settings
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Account & data
        </h1>
      </div>

      <Section
        title="Profile"
        description="Manage deeper account details (email, password, security) from your account dashboard."
      >
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-foreground text-background flex items-center justify-center text-lg font-semibold">
            {initials || "H"}
          </div>
          <div className="flex-1">
            <p className="text-base font-medium text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
            <p className="text-xs text-muted-foreground/70 font-mono mt-1">
              Joined {joined}
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Your data"
        description="Hintsight is yours. Export it any time — JSON for tools, CSV for spreadsheets."
      >
        <ExportButtons />
      </Section>

      <Section
        title="Help & references"
        description="Where to learn more or get unstuck."
      >
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/docs"
              className="text-foreground hover:underline underline-offset-4 inline-flex items-center gap-1"
            >
              Read the docs →
            </Link>
            <span className="text-muted-foreground">
              {" "}
              · how the loop works, how to log a useful prediction
            </span>
          </li>
          <li>
            <a
              href="https://github.com/techyMk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline underline-offset-4"
            >
              View source on GitHub →
            </a>
            <span className="text-muted-foreground">
              {" "}
              · open source, MIT licensed
            </span>
          </li>
        </ul>
      </Section>

      <Section
        title="Danger zone"
        description="Irreversible. Take a breath first."
        tone="danger"
      >
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete all predictions
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Wipes your prediction history but keeps your account.
              </p>
            </div>
            <DeletePredictionsButton />
          </div>
          <Separator className="my-5 bg-rose-500/20" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete account
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Manage account closure from your account dashboard.
              </p>
            </div>
            <Button
              render={
                <a
                  href="https://accounts.clerk.dev/user"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              variant="destructive"
              className="h-10 px-4"
            >
              Open account dashboard ↗
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  children,
  tone = "default",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <section
      className={`rounded-2xl border bg-card p-6 sm:p-7 ${
        tone === "danger" ? "border-rose-500/20" : "border-border"
      }`}
    >
      <header className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </header>
      {children}
    </section>
  );
}
