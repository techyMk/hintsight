-- Hintsight — public aggregate stats
-- Returns counts only (no PII). Marked SECURITY DEFINER so it bypasses RLS
-- for the specific aggregations we need. Safe because the body returns only
-- aggregated numbers, never individual row data.

create or replace function public_stats()
returns table (
  total_predictions bigint,
  total_forecasters bigint,
  total_reviewed bigint
)
language sql
security definer
stable
set search_path = public
as $$
  select
    count(*) as total_predictions,
    count(distinct user_id) as total_forecasters,
    count(*) filter (where status <> 'pending') as total_reviewed
  from predictions
$$;

-- Allow anonymous and authenticated users to call it
grant execute on function public_stats() to anon, authenticated;
