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

interface StreetAddressInput {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface SyncQuestionnaireContactInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  /** "cell" | "home" | "work" (matches the questionnaire's phone_type field). Defaults to "cell". */
  phoneType?: string;
  address?: StreetAddressInput;
  note: string;
  /** Wealthbox custom field name -> value. Fields not found by name in the Wealthbox account are skipped and logged. */
  customFieldValues?: Record<string, string>;
}

const PHONE_KIND_BY_TYPE: Record<string, string> = {
  cell: "Mobile",
  home: "Home",
  work: "Work",
};

// Wealthbox's country field expects a full country name, not an ISO/postal
// abbreviation - "USA" is silently dropped to an empty string otherwise.
// Every other COUNTRY_OPTIONS value in Section1.tsx is already a full name.
const WEALTHBOX_COUNTRY_NAME: Record<string, string> = {
  USA: "United States",
};

function hasAddress(address: StreetAddressInput | undefined): address is StreetAddressInput {
  if (!address) return false;
  return [address.street, address.city, address.state, address.zip, address.country].some(
    (v) => v.trim() !== ""
  );
}

interface WealthboxExistingContact {
  id: number;
  tags?: string[];
  background_information?: string;
  phone_numbers?: { id: number; kind?: string }[];
  street_addresses?: { id: number; kind?: string }[];
}

/**
 * Finds an existing entry of the same kind on the matched contact so an
 * update reuses its id (Wealthbox appends a new phone/address entry rather
 * than replacing one when no id is given), instead of accumulating a
 * duplicate on every sync.
 */
function existingIdByKind(
  entries: { id: number; kind?: string }[] | undefined,
  kind: string
): number | undefined {
  return entries?.find((e) => e.kind === kind)?.id;
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

  const match: WealthboxExistingContact | undefined = existing?.contacts?.[0];

  const emailAddresses = [{ address: input.email, principal: true, kind: "Work" }];
  const phoneKind = PHONE_KIND_BY_TYPE[input.phoneType ?? "cell"] ?? "Mobile";
  const addressCountry = hasAddress(input.address)
    ? WEALTHBOX_COUNTRY_NAME[input.address.country] ?? input.address.country
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

    // Reuse the existing entry's id (by kind) so this updates it in place -
    // omitting id here would append a duplicate on every re-sync instead.
    const phoneNumbers = input.phone
      ? [
          {
            ...(existingIdByKind(match.phone_numbers, phoneKind) !== undefined
              ? { id: existingIdByKind(match.phone_numbers, phoneKind) }
              : {}),
            address: input.phone,
            principal: true,
            kind: phoneKind,
          },
        ]
      : undefined;
    const streetAddresses = hasAddress(input.address)
      ? [
          {
            ...(existingIdByKind(match.street_addresses, "Home") !== undefined
              ? { id: existingIdByKind(match.street_addresses, "Home") }
              : {}),
            street_line_1: input.address.street,
            city: input.address.city,
            state: input.address.state,
            zip_code: input.address.zip,
            country: addressCountry,
            principal: true,
            kind: "Home",
          },
        ]
      : undefined;

    await wealthboxFetch(`/contacts/${match.id}`, {
      method: "PUT",
      body: JSON.stringify({
        tags,
        background_information,
        ...(phoneNumbers ? { phone_numbers: phoneNumbers } : {}),
        ...(streetAddresses ? { street_addresses: streetAddresses } : {}),
        ...(customFields.length > 0 ? { custom_fields: customFields } : {}),
      }),
    });

    return { id: match.id, created: false };
  }

  const newPhoneNumbers = input.phone
    ? [{ address: input.phone, principal: true, kind: phoneKind }]
    : undefined;
  const newStreetAddresses = hasAddress(input.address)
    ? [
        {
          street_line_1: input.address.street,
          city: input.address.city,
          state: input.address.state,
          zip_code: input.address.zip,
          country: addressCountry,
          principal: true,
          kind: "Home",
        },
      ]
    : undefined;

  const created = await wealthboxFetch("/contacts", {
    method: "POST",
    body: JSON.stringify({
      first_name: input.firstName,
      ...(input.middleName ? { middle_name: input.middleName } : {}),
      last_name: input.lastName,
      email_addresses: emailAddresses,
      ...(newPhoneNumbers ? { phone_numbers: newPhoneNumbers } : {}),
      ...(newStreetAddresses ? { street_addresses: newStreetAddresses } : {}),
      tags: [QUESTIONNAIRE_SOURCE_TAG],
      background_information: input.note,
      ...(customFields.length > 0 ? { custom_fields: customFields } : {}),
    }),
  });

  return { id: created.id, created: true };
}
