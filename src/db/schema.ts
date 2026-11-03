import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Change a table here, then run `pnpm run db:generate --name <what_changed>`
// and `pnpm run db:migrate`. Migrations are applied to the production D1
// database on publish.

/** Messages sent through the Contact page. */
export const messages = sqliteTable(
  'messages',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    /** A one-way hash of the sender's network address, used only for the rate limit. */
    senderKey: text('sender_key').notNull(),
    /** Whether a copy reached `ownerEmail`. */
    emailed: integer('emailed', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
  },
  (table) => [index('messages_sender_created_idx').on(table.senderKey, table.createdAt)]
);
