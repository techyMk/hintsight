/**
 * Seed a believable prediction history for the currently-signed-in user.
 *
 * Usage:
 *   1. Get your Clerk user id from /settings (or the Clerk dashboard).
 *   2. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (uncomment in template).
 *   3. Run: npx tsx scripts/seed-demo.ts <clerk_user_id>
 *
 * The script uses the service-role key to bypass RLS — only run locally,
 * never deploy this script.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

import { embed } from "../src/lib/embeddings";

config({ path: ".env.local" });

const userId = process.argv[2];
if (!userId) {
  console.error("Usage: npx tsx scripts/seed-demo.ts <clerk_user_id>");
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

type Seed = {
  text: string;
  category: "deals" | "hiring" | "product" | "finance" | "personal" | "other";
  confidence: number;
  /** days from today (negative = past). check_in_date = today + this. */
  daysOffset: number;
  /** 'pending' or final outcome. If outcome, daysOffset must be <= 0. */
  status: "pending" | "right" | "wrong" | "unclear";
  outcome_text?: string;
};

// Crafted to give a realistic calibration profile:
// - over-confident on deals (avg 75% stated, ~50% accurate)
// - well-calibrated on hiring (~70% stated, ~70% accurate)
// - under-confident on personal (~50% stated, ~70% accurate)
const SEEDS: Seed[] = [
  // ---- DEALS — overconfident ----
  { text: "Acme client signs the contract by Friday.", category: "deals", confidence: 80, daysOffset: -90, status: "wrong", outcome_text: "Pushed two weeks." },
  { text: "Q4 enterprise deal with Northwind closes before quarter-end.", category: "deals", confidence: 75, daysOffset: -75, status: "right" },
  { text: "We win the RFP against the incumbent.", category: "deals", confidence: 70, daysOffset: -60, status: "wrong", outcome_text: "Lost on price." },
  { text: "Pilot converts to a paid contract within 30 days.", category: "deals", confidence: 80, daysOffset: -45, status: "wrong" },
  { text: "Annual upsell call with Globex lands a $40k expansion.", category: "deals", confidence: 65, daysOffset: -30, status: "right" },
  { text: "Procurement at Initech finishes review by month-end.", category: "deals", confidence: 75, daysOffset: -15, status: "wrong" },
  { text: "Demo this week converts to a discovery call.", category: "deals", confidence: 70, daysOffset: 5, status: "pending" },
  { text: "We hit our quarterly new-logo target.", category: "deals", confidence: 60, daysOffset: 40, status: "pending" },

  // ---- HIRING — well-calibrated ----
  { text: "New senior engineer ships their first feature within 30 days.", category: "hiring", confidence: 75, daysOffset: -100, status: "right" },
  { text: "The PM candidate we offered accepts.", category: "hiring", confidence: 60, daysOffset: -80, status: "wrong", outcome_text: "Took counter-offer." },
  { text: "Designer hire stays past their 6-month mark.", category: "hiring", confidence: 70, daysOffset: -85, status: "right" },
  { text: "Onboarding for the new lead finishes in two weeks.", category: "hiring", confidence: 80, daysOffset: -55, status: "right" },
  { text: "Reference check turns up no surprises.", category: "hiring", confidence: 85, daysOffset: -40, status: "right" },
  { text: "We close two offers from this week's pipeline.", category: "hiring", confidence: 50, daysOffset: -10, status: "wrong" },
  { text: "Final-round candidate accepts our offer.", category: "hiring", confidence: 65, daysOffset: 7, status: "pending" },

  // ---- PRODUCT ----
  { text: "Redesigned onboarding lifts week-1 activation by 5pp.", category: "product", confidence: 60, daysOffset: -70, status: "right" },
  { text: "New pricing page beats the old one in conversion.", category: "product", confidence: 55, daysOffset: -50, status: "wrong" },
  { text: "We ship the search rewrite before quarter-end.", category: "product", confidence: 50, daysOffset: -20, status: "right" },
  { text: "The mobile gestures refactor takes under 2 weeks.", category: "product", confidence: 65, daysOffset: -8, status: "wrong", outcome_text: "Three weeks." },
  { text: "Public beta of the new dashboard ships by month-end.", category: "product", confidence: 70, daysOffset: 14, status: "pending" },

  // ---- FINANCE ----
  { text: "Burn rate stays under $80k this month.", category: "finance", confidence: 75, daysOffset: -60, status: "right" },
  { text: "We close the seed extension before the year ends.", category: "finance", confidence: 55, daysOffset: -30, status: "right" },
  { text: "AR collected within 60 days of invoice.", category: "finance", confidence: 80, daysOffset: -25, status: "wrong" },
  { text: "We finish the quarter cash-flow positive.", category: "finance", confidence: 50, daysOffset: 30, status: "pending" },

  // ---- PERSONAL — under-confident ----
  { text: "I keep my morning workout streak through the month.", category: "personal", confidence: 40, daysOffset: -50, status: "right" },
  { text: "I read four books this quarter.", category: "personal", confidence: 50, daysOffset: -30, status: "right" },
  { text: "I make it to the dentist appointment without rescheduling.", category: "personal", confidence: 55, daysOffset: -15, status: "right" },
  { text: "I finish the side project this weekend.", category: "personal", confidence: 35, daysOffset: -7, status: "wrong" },
  { text: "I hit 20km of running this week.", category: "personal", confidence: 45, daysOffset: 3, status: "pending" },
  { text: "I keep weekday phone screen-time under 2 hours.", category: "personal", confidence: 30, daysOffset: 10, status: "pending" },
];

function dateAt(offsetDays: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function tsAt(offsetDays: number): string {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString();
}

async function main() {
  console.log(`Seeding ${SEEDS.length} predictions for user ${userId}…`);

  let inserted = 0;
  let embedded = 0;
  for (const s of SEEDS) {
    const checkInDate = dateAt(s.daysOffset);
    const createdAt = tsAt(s.daysOffset - 30); // logged ~30d before check-in
    const resolvedAt = s.status !== "pending" ? tsAt(s.daysOffset) : null;

    const embedding = await embed(s.text);
    if (embedding) embedded += 1;

    const { error } = await supabase.from("predictions").insert({
      user_id: userId,
      text: s.text,
      category: s.category,
      confidence: s.confidence,
      check_in_date: checkInDate,
      status: s.status,
      outcome_text: s.outcome_text ?? null,
      resolved_at: resolvedAt,
      created_at: createdAt,
      embedding,
    });
    if (error) {
      console.error(`✗ ${s.text.slice(0, 40)}…`, error.message);
    } else {
      inserted += 1;
      process.stdout.write(".");
    }
  }
  console.log();
  console.log(`Inserted ${inserted} / ${SEEDS.length} (embeddings: ${embedded}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
