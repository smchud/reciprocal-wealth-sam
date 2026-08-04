import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { redeemWhitePaperToken } from "@/lib/white-paper";

// The PDF lives outside public/ on purpose: the only way to download it is
// through a verified email link. next.config.ts's outputFileTracingIncludes
// ensures the file ships with this route's serverless bundle.
const PDF_PATH = path.join(process.cwd(), "private", "white-paper.pdf");
const DOWNLOAD_FILENAME = "Reciprocal Wealth - Reciprocity For All White Paper.pdf";

function logError(event: string, data: Record<string, unknown>) {
  console.error(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!token) {
    return new NextResponse("This download link is invalid.", { status: 400 });
  }

  let email: string | null;
  try {
    email = await redeemWhitePaperToken(token);
  } catch (err) {
    logError("white_paper_download_failed", { message: String(err) });
    return new NextResponse("Something went wrong. Please try again.", { status: 500 });
  }

  if (!email) {
    return new NextResponse(
      "This download link is invalid or has expired. Please request a new one at reciprocalwealth.com/why-reciprocal.",
      { status: 410 }
    );
  }

  try {
    const pdf = await readFile(PDF_PATH);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${DOWNLOAD_FILENAME}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    logError("white_paper_pdf_read_failed", { message: String(err) });
    return new NextResponse("Something went wrong. Please try again.", { status: 500 });
  }
}
