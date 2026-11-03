// Contact form rules, shared by the form and the server. The server is the
// one that decides: everything here runs again in `submitContact`.

export const LIMITS = {
  name: 100,
  email: 254,
  messageMin: 10,
  message: 5000,
  /** Messages one sender may send in `windowMinutes`. */
  perWindow: 3,
  windowMinutes: 10
} as const;

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  /** Hidden from people; bots fill it in. */
  website: string;
};

export type ContactField = 'name' | 'email' | 'message';
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactResult =
  | { ok: true; name: string }
  | { ok: false; errors: ContactErrors }
  | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepts anything the browser sends and returns four trimmed strings. */
export function readContactInput(raw: unknown): ContactInput {
  const get = (key: string) => {
    const value =
      raw instanceof FormData
        ? raw.get(key)
        : raw && typeof raw === 'object'
          ? (raw as Record<string, unknown>)[key]
          : undefined;
    return typeof value === 'string' ? value.trim() : '';
  };
  return {
    name: get('name').slice(0, LIMITS.name * 2),
    email: get('email').slice(0, LIMITS.email * 2),
    message: get('message').slice(0, LIMITS.message * 2),
    website: get('website')
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (!input.name) errors.name = 'Tell us your name.';
  else if (input.name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;

  if (!input.email) errors.email = 'We need an address to reply to.';
  else if (input.email.length > LIMITS.email || !EMAIL.test(input.email))
    errors.email = 'That doesn’t look like an email address.';

  if (input.message.length < LIMITS.messageMin)
    errors.message = 'A sentence or two about the project, please.';
  else if (input.message.length > LIMITS.message)
    errors.message = `Keep it under ${LIMITS.message} characters; we can talk about the rest.`;
  return errors;
}

export type ContactDeps = {
  /** How many messages this sender saved since `since`. */
  countRecent: (senderKey: string, since: Date) => Promise<number>;
  save: (message: { name: string; email: string; message: string; senderKey: string }) => Promise<string>;
  /** Emails the owner, if an owner address is set. Returns whether it was sent. */
  notify?: (message: { id: string; name: string; email: string; message: string }) => Promise<boolean>;
  markEmailed?: (id: string) => Promise<void>;
  now?: () => Date;
};

/** The whole submission: honeypot, validation, rate limit, save, then email. */
export async function handleContact(
  raw: unknown,
  senderKey: string,
  deps: ContactDeps
): Promise<ContactResult> {
  const input = readContactInput(raw);

  // A filled honeypot is a bot. Look successful so it moves on; save nothing.
  if (input.website) return { ok: true, name: input.name || 'there' };

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const now = deps.now?.() ?? new Date();
  const since = new Date(now.getTime() - LIMITS.windowMinutes * 60_000);
  if ((await deps.countRecent(senderKey, since)) >= LIMITS.perWindow) {
    return {
      ok: false,
      error: `That’s ${LIMITS.perWindow} messages in a few minutes. Please wait a little, or write to us directly.`
    };
  }

  const message = { name: input.name, email: input.email, message: input.message };
  const id = await deps.save({ ...message, senderKey });

  if (deps.notify) {
    try {
      if (await deps.notify({ id, ...message })) await deps.markEmailed?.(id);
    } catch (error) {
      // The message is saved; a failed notification must not fail the visitor.
      console.warn('[contact] notification failed', error);
    }
  }
  return { ok: true, name: input.name };
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

/** The email the owner receives for each message. */
export function ownerEmailBody(message: { name: string; email: string; message: string }, site: string) {
  return {
    subject: `${site}: message from ${message.name}`.replace(/[\r\n]+/g, ' ').slice(0, 200),
    text: `${message.name} <${message.email}> wrote through the contact form:\n\n${message.message}\n`,
    html: `<p><strong>${escapeHtml(message.name)}</strong> &lt;${escapeHtml(message.email)}&gt; wrote through the contact form:</p><p style="white-space:pre-wrap">${escapeHtml(message.message)}</p>`
  };
}
