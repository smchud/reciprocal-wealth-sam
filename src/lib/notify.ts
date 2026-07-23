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
