-- AUM axis correction: investable_assets is a 6-way range question, never
-- an exact dollar figure, so there is no real dollar value to store.
-- Replaces the fabricated aum_value (bucket lower-bound) with a graded
-- 0-100 aum_score (one fixed value per range) and the verbatim range
-- label text, both looked up directly from the selected range - never a
-- numeric dollar threshold. aum_bucket (the range's code) is unchanged.

alter table intake_submissions
  drop column if exists aum_value,
  add column if not exists aum_range_label text,
  add column if not exists aum_score integer;
