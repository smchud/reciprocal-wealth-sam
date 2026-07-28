-- Phase 6, Stage 2 follow-up: internal AUM/Effort prioritization matrix.
-- Same treatment as the risk score and psychographic archetype: computed
-- server-side, stored here, rendered in the founders' PDF only - never
-- sent to the client, never sent to Wealthbox, never in any client-facing
-- API response or page source.
--
-- Nullable (not `not null`) because this is an additive migration on a
-- table that already has rows from before this feature existed; every
-- submission going forward always populates all seven columns.

alter table intake_submissions
  add column if not exists priority_quadrant text,
  add column if not exists effort_score_services integer,
  add column if not exists effort_score_involvement integer,
  add column if not exists effort_score_communication integer,
  add column if not exists effort_score_total integer,
  add column if not exists aum_bucket text,
  add column if not exists aum_value integer;
