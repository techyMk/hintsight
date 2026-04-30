-- Hintsight — memory / vector search support
-- Adds HNSW index on predictions.embedding (cosine) and an RPC for top-k
-- search scoped to the calling Clerk user.

-- HNSW is preferred over IVF for small-to-medium tables and incremental writes.
create index if not exists predictions_embedding_hnsw
  on predictions
  using hnsw (embedding vector_cosine_ops);

-- Returns the top-k predictions most similar to a query embedding for the
-- current user. Cosine similarity = 1 - cosine distance.
create or replace function match_predictions(
  query_embedding vector(384),
  match_count int default 8,
  similarity_threshold float default 0.2
)
returns table (
  id uuid,
  text text,
  category text,
  confidence smallint,
  status text,
  check_in_date date,
  outcome_text text,
  resolved_at timestamptz,
  created_at timestamptz,
  similarity float
)
language sql
stable
security invoker
as $$
  select
    p.id,
    p.text,
    p.category,
    p.confidence,
    p.status,
    p.check_in_date,
    p.outcome_text,
    p.resolved_at,
    p.created_at,
    (1 - (p.embedding <=> query_embedding))::float as similarity
  from predictions p
  where p.user_id = (select auth.jwt()->>'sub')
    and p.embedding is not null
    and (1 - (p.embedding <=> query_embedding)) >= similarity_threshold
  order by p.embedding <=> query_embedding
  limit match_count;
$$;
