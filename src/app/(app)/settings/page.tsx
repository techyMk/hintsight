import { currentUser } from "@clerk/nextjs/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
          Account & preferences
        </h1>
      </div>

      {/* Profile */}
      <Section
        title="Profile"
        description="Identity used across Hintsight. Edit deeper details in your account dashboard."
      >
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-foreground text-background flex items-center justify-center text-lg font-semibold">
            {initials || "H"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-medium text-foreground">{name}</p>
              <Badge variant="muted">free plan</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{email}</p>
            <p className="text-xs text-muted-foreground/70 font-mono mt-1">
              Joined {joined}
            </p>
          </div>
        </div>
      </Section>

      {/* Preferences */}
      <Section
        title="Preferences"
        description="Tune the rhythm of Hintsight to your workflow."
      >
        <div className="space-y-5">
          <Field
            label="Default check-in window"
            hint="How far ahead Hintsight schedules your next review by default."
          >
            <select
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 outline-none"
              defaultValue="30"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </Field>

          <Field
            label="Weekly digest"
            hint="A short Monday email summarising what's due and how your calibration is trending."
          >
            <Toggle defaultChecked />
          </Field>

          <Field
            label="Voice input"
            hint="Use the browser's speech recognition when logging on mobile or hands-free."
          >
            <Toggle defaultChecked />
          </Field>

          <Field
            label="Theme"
            hint="System default follows your OS."
          >
            <div className="inline-flex rounded-lg border border-border bg-background p-1 text-sm">
              {["System", "Light", "Dark"].map((t, i) => (
                <button
                  key={t}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    i === 0
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </Section>

      {/* Calibration tuning */}
      <Section
        title="Calibration tuning"
        description="Optional knobs that shape how Hintsight scores you."
      >
        <div className="space-y-5">
          <Field
            label="Minimum reviewed predictions before scoring"
            hint="Below this, the calibration arc stays placeholder. 20 is the sensible default."
          >
            <Input
              type="number"
              defaultValue={20}
              min={5}
              max={200}
              className="w-24 text-center"
            />
          </Field>

          <Field
            label="Bin size for calibration plot"
            hint="Wider bins smooth the curve; narrower bins reveal more detail."
          >
            <select
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none"
              defaultValue="10"
            >
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="20">20%</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* Data */}
      <Section
        title="Your data"
        description="Hintsight is yours. Export it any time. Delete it any time."
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <DataCard
            title="Export predictions"
            body="Download every prediction and outcome as JSON or CSV."
            cta="Export JSON"
          />
          <DataCard
            title="Privacy"
            body="Your text is never used to train models. We use temporary AI calls for extraction only."
            cta="Read policy"
            variant="muted"
          />
        </div>
      </Section>

      {/* Danger zone */}
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
            <Button variant="destructive" className="h-10 px-4">
              Delete predictions…
            </Button>
          </div>
          <Separator className="my-5 bg-rose-500/20" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete account
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Closes your account and removes all data permanently.
              </p>
            </div>
            <Button variant="destructive" className="h-10 px-4">
              Delete account…
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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-start sm:items-center">
      <div>
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <div className="sm:justify-self-end">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="w-10 h-6 bg-foreground/10 rounded-full transition-colors peer-checked:bg-foreground" />
      <span className="absolute left-0.5 top-0.5 size-5 bg-background rounded-full shadow transition-transform peer-checked:translate-x-4" />
    </label>
  );
}

function DataCard({
  title,
  body,
  cta,
  variant = "default",
}: {
  title: string;
  body: string;
  cta: string;
  variant?: "default" | "muted";
}) {
  return (
    <div
      className={`rounded-xl border border-border p-5 ${
        variant === "muted" ? "bg-muted/30" : "bg-background"
      }`}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        {body}
      </p>
      <Button variant="outline" size="sm" className="mt-4">
        {cta}
      </Button>
    </div>
  );
}
