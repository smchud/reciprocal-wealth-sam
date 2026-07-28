-- Phase 6, Stage 2: completed-submission storage. A row here is the
-- durable compliance record: the final answer snapshot plus the computed
-- risk/psychographic output, which is never sent to the client - only
-- into this table and the founders' PDF email.

create table if not exists intake_submissions (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references intake_drafts(id),
  data jsonb not null,
  email text,
  first_name text,
  last_name text,

  final_risk_score integer not null,
  risk_profile text not null,
  indicative_equity_allocation text not null,
  risk_tolerance_score integer not null,
  age_factor integer not null,
  situation_factor integer not null,
  tolerance_breakdown jsonb not null,
  situation_breakdown jsonb not null,

  psychographic_archetype text not null,
  psychographic_performance_score integer not null,
  psychographic_contact_score integer not null,
  psychographic_breakdown jsonb not null,

  wealthbox_contact_id text,
  wealthbox_synced_at timestamptz,
  pdf_emailed_at timestamptz,

  created_at timestamptz not null default now()
);

create index if not exists intake_submissions_draft_id_idx on intake_submissions(draft_id);
create unique index if not exists intake_submissions_draft_id_unique on intake_submissions(draft_id);
