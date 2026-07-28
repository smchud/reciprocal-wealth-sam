-- Effort score formula v2: replaces the single "communication" (contact
-- channel) component with two components - contact_frequency and
-- checking_frequency (how often they want to hear from us, and how often
-- they check their own accounts). Same internal-only treatment as before.
--
-- Drops the now-obsolete communication column and adds the two new ones.
-- Nullable, same reasoning as migration 0003: additive change on a table
-- that already has rows from the prior formula.

alter table intake_submissions
  drop column if exists effort_score_communication,
  add column if not exists effort_score_contact_frequency integer,
  add column if not exists effort_score_account_checking integer;
