import { Resend } from "resend";
import { founders } from "@/data/founders";

interface NotifyInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const FROM_ADDRESS =
  process.env.CONTACT_FROM_EMAIL ?? "Reciprocal Wealth Website <notifications@send.reciprocalwealth.com>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Emails both founders about a new contact form submission. Throws on
 * failure - callers decide how to respond to the visitor.
 */
export async function notifyFounders(input: NotifyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  const resend = new Resend(apiKey);
  const to = founders.map((f) => f.email);

  const textLines = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "(not provided)"}`,
    "",
    "Message:",
    input.message,
  ];

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Phone:</strong> ${input.phone ? escapeHtml(input.phone) : "(not provided)"}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>
  `;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    replyTo: input.email,
    subject: `New Talk to Us submission from ${input.name}`,
    text: textLines.join("\n"),
    html,
  });

  if (error) throw new Error(`Resend send failed: ${error.message}`);
}

/**
 * Emails the founders-only PDF summary of a completed questionnaire
 * submission. Throws on failure - the caller treats this as best-effort and
 * must not let it block the visitor-facing response.
 */
export async function sendSubmissionSummary(
  clientName: string,
  pdfBuffer: Buffer
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  const resend = new Resend(apiKey);
  const to = founders.map((f) => f.email);
  const filename = `${clientName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "questionnaire"}-summary.pdf`;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `New questionnaire submission — ${clientName}`,
    text: `${clientName} completed the intake questionnaire. Summary attached.`,
    html: `<p>${escapeHtml(clientName)} completed the intake questionnaire. Summary attached.</p>`,
    attachments: [{ filename, content: pdfBuffer }],
  });

  if (error) throw new Error(`Resend send failed: ${error.message}`);
}

/**
 * Emails the branded verify-and-download link for the Reciprocity For All
 * white paper. Throws on failure - callers decide how to respond to the
 * visitor.
 */
export async function sendWhitePaperEmail(email: string, downloadUrl: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  const resend = new Resend(apiKey);
  const safeUrl = escapeHtml(downloadUrl);

  const text = [
    "Email Verification Request & White Paper Download",
    "",
    "Thank you for your interest in Reciprocity For All. Use the link below to verify your email address and download our white paper:",
    "",
    downloadUrl,
    "",
    "This link expires in 72 hours. If you didn't request the white paper, you can ignore this email.",
    "",
    "Reciprocal Wealth, LLC",
  ].join("\n");

  // Table-based layout + inline styles for broad email-client support.
  // The logo is referenced from the live production site so it renders in
  // email clients regardless of where the sending deployment lives.
  const html = `
    <div style="background-color:#F0EFED;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
        <tr>
          <td style="background-color:#04342C;padding:28px 40px;text-align:center;">
            <img src="https://reciprocalwealth.com/images/logo-horizontal-dark.png" alt="Reciprocal Wealth" width="200" style="display:inline-block;max-width:200px;height:auto;" />
          </td>
        </tr>
        <tr>
          <td style="background-color:#ffffff;padding:36px 40px;">
            <h1 style="margin:0 0 16px;font-size:20px;line-height:1.35;color:#1A1A18;font-weight:bold;">
              Email Verification Request &amp; White Paper Download
            </h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#1A1A18;">
              Thank you for your interest in Reciprocity For All. Click the button
              below to verify your email address and download our white paper.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="background-color:#0F6E56;border-radius:2px;">
                  <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">
                    Verify &amp; download now
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#888780;">
              This link expires in 72 hours. If you didn't request the white paper,
              you can ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#888780;">
              Reciprocal Wealth, LLC
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: [email],
    subject: "Email Verification Request & White Paper Download",
    text,
    html,
  });

  if (error) throw new Error(`Resend send failed: ${error.message}`);
}

/**
 * Emails a single-use resume link for the /get-started questionnaire.
 * Throws on failure - callers decide how to respond to the visitor.
 */
export async function sendResumeLink(email: string, resumeUrl: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  const resend = new Resend(apiKey);

  const text = [
    "Here's your link to pick up where you left off on the Reciprocal Wealth questionnaire:",
    "",
    resumeUrl,
    "",
    "This link is unique to you, can only be used once, and expires in 72 hours. If you didn't request it, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>Here's your link to pick up where you left off on the Reciprocal Wealth questionnaire:</p>
    <p><a href="${escapeHtml(resumeUrl)}">${escapeHtml(resumeUrl)}</a></p>
    <p style="color:#6b746f;font-size:13px;">This link is unique to you, can only be used once, and expires in 72 hours. If you didn't request it, you can ignore this email.</p>
  `;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: [email],
    subject: "Finish your Reciprocal Wealth questionnaire",
    text,
    html,
  });

  if (error) throw new Error(`Resend send failed: ${error.message}`);
}
