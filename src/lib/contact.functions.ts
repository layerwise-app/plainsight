import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { env } from 'cloudflare:workers';
import { and, count, eq, gte } from 'drizzle-orm';
import { db } from '~/db';
import { messages } from '~/db/schema';
import { handleContact, ownerEmailBody } from '~/lib/contact';
import { portfolio } from '~/portfolio.config';

/** A one-way key for the sender's address, so raw IPs are never stored. */
async function senderKey() {
  const address =
    getRequestHeader('cf-connecting-ip') ??
    getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() ??
    getRequestHeader('x-real-ip') ??
    'unknown';
  const bytes = new TextEncoder().encode(`contact:${portfolio.name}:${address}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const submitContact = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as Record<string, string>)
  .handler(async ({ data }) =>
    handleContact(data, await senderKey(), {
      countRecent: async (key, since) => {
        const [row] = await db
          .select({ total: count() })
          .from(messages)
          .where(and(eq(messages.senderKey, key), gte(messages.createdAt, since)));
        return row?.total ?? 0;
      },
      save: async (message) => {
        const [row] = await db.insert(messages).values(message).returning({ id: messages.id });
        return row.id;
      },
      notify: portfolio.ownerEmail
        ? async (message) => {
            const { error } = await env.EMAIL.send({
              to: portfolio.ownerEmail,
              replyTo: message.email,
              ...ownerEmailBody(message, portfolio.name)
            });
            if (error) console.warn(`[contact] email for ${message.id}: ${error.code} ${error.message}`);
            return !error;
          }
        : undefined,
      markEmailed: async (id) => {
        await db.update(messages).set({ emailed: true }).where(eq(messages.id, id));
      }
    })
  );
