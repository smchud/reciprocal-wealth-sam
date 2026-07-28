const WEALTHBOX_API_BASE = "https://api.crmworkspace.com/v1";
const SOURCE_TAG = "website — contact form";
const QUESTIONNAIRE_SOURCE_TAG = "website — questionnaire";

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

interface SyncQuestionnaireContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  note: string;
  /** Wealthbox custom field name -> value. Fields not found by name in the Wealthbox account are skipped and logged. */
  customFieldValues?: Record<string, string>;
}

interface WealthboxCustomFieldDefinition {
  id: number;
  name: string;
}

/**
 * Fetches the account's Contact custom field definitions and resolves the
 * given name -> value map into Wealthbox's { id, value } shape, by exact
 * (case-insensitive) name match. Names not found in the account are
 * dropped with a warning rather than failing the whole sync - a renamed
 * or deleted Wealthbox field shouldn't block the contact from syncing at
 * all. Failure to even fetch the field list (network issue, endpoint
 * change, etc) is likewise non-fatal - it just means no custom fields get
 * set on this sync, not that the contact/note/tags update never happens.
 */
async function resolveCustomFields(
  values: Record<string, string>
): Promise<{ id: number; value: string }[]> {
  if (Object.keys(values).length === 0) return [];

  let definitions: WealthboxCustomFieldDefinition[];
  try {
    const res = await wealthboxFetch("/categories/custom_fields?document_type=Contact", { method: "GET" });
    definitions = res?.custom_fields ?? res ?? [];
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "wealthbox_custom_fields_fetch_failed",
        ts: new Date().toISOString(),
        message: String(err),
      })
    );
    return [];
  }

  const byName = new Map<string, number>();
  for (const def of definitions) {
    if (def?.name && typeof def.id === "number") {
      byName.set(def.name.trim().toLowerCase(), def.id);
    }
  }

  const resolved: { id: number; value: string }[] = [];
  const missing: string[] = [];
  for (const [name, value] of Object.entries(values)) {
    const id = byName.get(name.trim().toLowerCase());
    if (id === undefined) {
      missing.push(name);
      continue;
    }
    resolved.push({ id, value });
  }

  if (missing.length > 0) {
    console.error(
      JSON.stringify({
        event: "wealthbox_custom_fields_not_found",
        ts: new Date().toISOString(),
        missing,
      })
    );
  }

  return resolved;
}

/**
 * Creates a new Wealthbox contact, or updates an existing one found by
 * email, tagging it with the website-questionnaire source, appending a
 * note summarizing the submission, and populating any matching custom
 * fields. Best-effort: callers should catch and log failures rather than
 * let them block the visitor-facing response.
 */
export async function syncQuestionnaireContact(
  input: SyncQuestionnaireContactInput
): Promise<{ id: number; created: boolean }> {
  const existing = await wealthboxFetch(`/contacts?email=${encodeURIComponent(input.email)}`, {
    method: "GET",
  });

  const match = existing?.contacts?.[0];

  const emailAddresses = [{ address: input.email, principal: true, kind: "Work" }];
  const phoneNumbers = input.phone
    ? [{ address: input.phone, principal: true, kind: "Mobile" }]
    : undefined;
  const customFields = await resolveCustomFields(input.customFieldValues ?? {});

  if (match) {
    const existingTags: string[] = match.tags ?? [];
    const tags = existingTags.includes(QUESTIONNAIRE_SOURCE_TAG)
      ? existingTags
      : [...existingTags, QUESTIONNAIRE_SOURCE_TAG];
    const existingBackground: string = match.background_information ?? "";
    const background_information = existingBackground
      ? `${existingBackground}\n\n${input.note}`
      : input.note;

    await wealthboxFetch(`/contacts/${match.id}`, {
      method: "PUT",
      body: JSON.stringify({
        tags,
        background_information,
        ...(phoneNumbers ? { phone_numbers: phoneNumbers } : {}),
        ...(customFields.length > 0 ? { custom_fields: customFields } : {}),
      }),
    });

    return { id: match.id, created: false };
  }

  const created = await wealthboxFetch("/contacts", {
    method: "POST",
    body: JSON.stringify({
      first_name: input.firstName,
      last_name: input.lastName,
      email_addresses: emailAddresses,
      ...(phoneNumbers ? { phone_numbers: phoneNumbers } : {}),
      tags: [QUESTIONNAIRE_SOURCE_TAG],
      background_information: input.note,
      ...(customFields.length > 0 ? { custom_fields: customFields } : {}),
    }),
  });

  return { id: created.id, created: true };
}
