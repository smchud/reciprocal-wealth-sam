-- Phase 6, Stage 1: draft/session storage for the /get-started intake flow.
-- A draft row is created only after explicit consent (see intake-session.ts),
-- so "no row exists yet" doubles as "no data has been stored yet."
-- Stage 2 adds the completed-submission table on top of this.

create extension if not exists pgcrypto;

create table if not exists intake_drafts (
  id uuid primary key default gen_random_uuid(),
  session_token_hash text not null unique,
  email text,
  data jsonb not null default '{}'::jsonb,
  current_step text not null default 'welcome',
  consent_given_at timestamptz not null default now(),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists intake_resume_tokens (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references intake_drafts(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists intake_resume_tokens_draft_id_idx on intake_resume_tokens(draft_id);
