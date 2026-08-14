import { NextRequest, NextResponse } from "next/server";
import { redeemResumeToken, setSessionCookie } from "@/lib/get-started/session";
import { reportError } from "@/lib/observability";

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
    reportError("get_started_resume_redeem_failed", { message: String(err) }, err);
    return NextResponse.redirect(`${origin}/get-started?resume_error=1`);
  }
}
