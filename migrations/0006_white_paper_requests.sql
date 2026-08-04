-- White paper download flow: every email entered on the Why Reciprocal page
-- gets a row here, plus a hashed verification token. Clicking the emailed
-- verification link marks verified_at and streams the PDF.

create table if not exists white_paper_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists white_paper_requests_email_idx on white_paper_requests(email);
