import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { isKnownFieldName, type SectionId } from "@/data/intakeFields";

const SESSION_COOKIE = "rw_intake_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
export const RESUME_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

export interface DraftRow {
  id: string;
  email: string | null;
  data: Record<string, unknown>;
  current_step: SectionId;
  submitted_at: string | null;
}

function randomToken() {
  return randomBytes(32).toString("base64url");
}

function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

function cookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/**
 * Creates a new draft row — only called once consent has been affirmed by
 * the caller. No row exists before this, so "no data stored before consent"
 * holds literally, not just in the UI.
 */
export async function createDraft(): Promise<{ draftId: string; sessionToken: string }> {
  const sessionToken = randomToken();
  const { rows } = await query<{ id: string }>(
    `insert into intake_drafts (session_token_hash) values ($1) returning id`,
    [hashToken(sessionToken)]
  );
  return { draftId: rows[0].id, sessionToken };
}

export async function setSessionCookie(sessionToken: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken, cookieOptions());
}

export async function getDraftFromSession(): Promise<DraftRow | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const { rows } = await query<DraftRow>(
    `select id, email, data, current_step, submitted_at
     from intake_drafts where session_token_hash = $1`,
    [hashToken(token)]
  );
  return rows[0] ?? null;
}

/** Drops any keys not in the approved schema before they ever reach the database. */
export function sanitizePatch(patch: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (isKnownFieldName(key)) clean[key] = value;
  }
  return clean;
}

export async function saveDraftStep(
  draftId: string,
  step: SectionId,
  patch: Record<string, unknown>,
  email?: string | null
) {
  const clean = sanitizePatch(patch);
  await query(
    `update intake_drafts
     set data = data || $2::jsonb,
         current_step = $3,
         email = coalesce($4, email),
         updated_at = now()
     where id = $1`,
    [draftId, JSON.stringify(clean), step, email ?? null]
  );
}

export async function markDraftSubmitted(draftId: string) {
  await query(
    `update intake_drafts set submitted_at = now(), updated_at = now() where id = $1`,
    [draftId]
  );
}

/** Basic per-draft cooldown so a repeated click can't fire a burst of emails. */
export async function resumeTokenRecentlyIssued(draftId: string, withinMs: number): Promise<boolean> {
  const { rows } = await query<{ recent: boolean }>(
    `select exists (
       select 1 from intake_resume_tokens
       where draft_id = $1 and created_at > now() - ($2 || ' milliseconds')::interval
     ) as recent`,
    [draftId, withinMs]
  );
  return rows[0]?.recent ?? false;
}

/** Generates a single-use, expiring resume token and stores only its hash. */
export async function issueResumeToken(draftId: string): Promise<string> {
  const raw = randomToken();
  const expiresAt = new Date(Date.now() + RESUME_TOKEN_TTL_MS);
  await query(
    `insert into intake_resume_tokens (draft_id, token_hash, expires_at)
     values ($1, $2, $3)`,
    [draftId, hashToken(raw), expiresAt.toISOString()]
  );
  return raw;
}

/**
 * Validates and redeems a resume token in one atomic statement (the
 * `used_at is null` predicate in the UPDATE makes replay impossible even
 * under concurrent requests), rotates the draft's session token so the old
 * device's cookie stops working, and returns the fresh session token to set
 * on the redeeming request.
 */
export async function redeemResumeToken(
  rawToken: string
): Promise<{ draftId: string; sessionToken: string } | null> {
  const tokenHash = hashToken(rawToken);
  const { rows } = await query<{ draft_id: string }>(
    `update intake_resume_tokens
     set used_at = now()
     where token_hash = $1 and used_at is null and expires_at > now()
     returning draft_id`,
    [tokenHash]
  );
  const draftId = rows[0]?.draft_id;
  if (!draftId) return null;

  const sessionToken = randomToken();
  await query(`update intake_drafts set session_token_hash = $2 where id = $1`, [
    draftId,
    hashToken(sessionToken),
  ]);
  return { draftId, sessionToken };
}
