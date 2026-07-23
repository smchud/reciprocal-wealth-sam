const WEALTHBOX_API_BASE = "https://api.crmworkspace.com/v1";
const SOURCE_TAG = "website — contact form";

interface SyncContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function wealthboxFetch(path: string, init: RequestInit) {
  const token = process.env.WEALTHBOX_API_TOKEN;
  if (!token) throw new Error("WEALTHBOX_API_TOKEN is not configured");

  const res = await fetch(`${WEALTHBOX_API_BASE}${path}`, {
    ...init,
    headers: {
      ACCESS_TOKEN: token,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Wealthbox ${init.method ?? "GET"} ${path} -> ${res.status}: ${body.slice(0, 500)}`);
  }

  return res.json();
}

/**
 * Creates a new Wealthbox contact, or updates an existing one found by email,
 * tagging it with the website-contact-form source and appending the message
 * to background_information. Best-effort: callers should catch and log
 * failures rather than let them block the visitor-facing response.
 */
export async function syncContact(input: SyncContactInput): Promise<{ id: number; created: boolean }> {
  const { firstName, lastName } = splitName(input.name);
  const timestamp = new Date().toISOString();
  const note = `[${timestamp}] Website contact form message:\n${input.message}`;

  const existing = await wealthboxFetch(`/contacts?email=${encodeURIComponent(input.email)}`, {
    method: "GET",
  });

  const match = existing?.contacts?.[0];

  const emailAddresses = [{ address: input.email, principal: true, kind: "Work" }];
  const phoneNumbers = input.phone
    ? [{ address: input.phone, principal: true, kind: "Mobile" }]
    : undefined;

  if (match) {
    const existingTags: string[] = match.tags ?? [];
    const tags = existingTags.includes(SOURCE_TAG) ? existingTags : [...existingTags, SOURCE_TAG];
    const existingBackground: string = match.background_information ?? "";
    const background_information = existingBackground ? `${existingBackground}\n\n${note}` : note;

    await wealthboxFetch(`/contacts/${match.id}`, {
      method: "PUT",
      body: JSON.stringify({
        tags,
        background_information,
        ...(phoneNumbers ? { phone_numbers: phoneNumbers } : {}),
      }),
    });

    return { id: match.id, created: false };
  }

  const created = await wealthboxFetch("/contacts", {
    method: "POST",
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email_addresses: emailAddresses,
      ...(phoneNumbers ? { phone_numbers: phoneNumbers } : {}),
      tags: [SOURCE_TAG],
      background_information: note,
    }),
  });

  return { id: created.id, created: true };
}
