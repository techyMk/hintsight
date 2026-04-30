-- Hintsight — initial schema
-- Run in Supabase SQL editor (or via supabase CLI).
-- Assumes Clerk is configured as a Third-Party Auth provider in
-- Supabase dashboard → Authentication → Sign In / Providers → Clerk.
-- With that wired up, auth.jwt()->>'sub' resolves to the Clerk user id.

create extension if not exists "vector";
create extension if not exists "pgcrypto";

create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  text text not null check (length(text) between 1 and 4000),
  category text,
  confidence smallint check (confidence between 0 and 100),
  check_in_date date not null,
  status text not null default 'pending'
    check (status in ('pending', 'right', 'wrong', 'unclear')),
  outcome_text text,
  resolved_at timestamptz,
  embedding vector(384),
  created_at timestamptz not null default now()
);

create index if not exists predictions_user_created_idx
  on predictions (user_id, created_at desc);

create index if not exists predictions_user_status_check_in_idx
  on predictions (user_id, status, check_in_date);

alter table predictions enable row level security;

create policy "predictions_select_own"
  on predictions for select
  to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "predictions_insert_own"
  on predictions for insert
  to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "predictions_update_own"
  on predictions for update
  to authenticated
  using (user_id = (select auth.jwt()->>'sub'))
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "predictions_delete_own"
  on predictions for delete
  to authenticated
  using (user_id = (select auth.jwt()->>'sub'));
