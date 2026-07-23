import { NextRequest, NextResponse } from "next/server";
import { redeemResumeToken, setSessionCookie } from "@/lib/get-started/session";

function logError(event: string, data: Record<string, unknown>) {
  console.error(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const origin = req.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/get-started?resume_error=1`);
  }

  try {
    const redeemed = await redeemResumeToken(token);
    if (!redeemed) {
      return NextResponse.redirect(`${origin}/get-started?resume_error=1`);
    }
    await setSessionCookie(redeemed.sessionToken);
    return NextResponse.redirect(`${origin}/get-started?resumed=1`);
  } catch (err) {
    logError("get_started_resume_redeem_failed", { message: String(err) });
    return NextResponse.redirect(`${origin}/get-started?resume_error=1`);
  }
}
