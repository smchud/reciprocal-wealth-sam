import { randomBytes, createHash } from "node:crypto";
import { query } from "@/lib/db";

// Verification links stay valid for 72 hours and can be clicked more than
// once within that window - a failed or interrupted download shouldn't
// strand the visitor with a dead link.
const TOKEN_TTL_HOURS = 72;

function newRawToken(): string {
  return randomBytes(32).toString("base64url");
}

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * Records a white paper request for this email and returns the raw
 * verification token to embed in the emailed link. Only the SHA-256 hash is
 * stored.
 */
export async function createWhitePaperRequest(email: string): Promise<string> {
  const rawToken = newRawToken();
  await query(
    `insert into white_paper_requests (email, token_hash, expires_at)
     values ($1, $2, now() + interval '${TOKEN_TTL_HOURS} hours')`,
    [email, hashToken(rawToken)]
  );
  return rawToken;
}

/**
 * True if this email already received a verification link within the given
 * window - used to swallow rapid duplicate submissions without sending
 * another email.
 */
export async function whitePaperRecentlyRequested(
  email: string,
  windowMs: number
): Promise<boolean> {
  const { rows } = await query<{ id: string }>(
    `select id from white_paper_requests
     where email = $1 and created_at > now() - ($2 || ' milliseconds')::interval
     limit 1`,
    [email, String(windowMs)]
  );
  return rows.length > 0;
}

/**
 * Validates a raw verification token. On success, stamps verified_at (first
 * click only) and returns the request row's email; returns null for unknown
 * or expired tokens.
 */
export async function redeemWhitePaperToken(raw: string): Promise<string | null> {
  const { rows } = await query<{ id: string; email: string }>(
    `update white_paper_requests
     set verified_at = coalesce(verified_at, now())
     where token_hash = $1 and expires_at > now()
     returning id, email`,
    [hashToken(raw)]
  );
  return rows[0]?.email ?? null;
}
