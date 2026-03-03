import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Decks created by a Clerk user
export const decks = pgTable(
  "decks",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    // Clerk user ID (string identifier from Clerk)
    userId: varchar({ length: 255 }).notNull(),

    // Human-friendly name of the deck, e.g. "Indonesian from English"
    name: varchar({ length: 255 }).notNull(),

    // Optional description, e.g. "Everyday vocabulary" or "British history basics"
    description: text(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdIdx: index("decks_user_id_idx").on(t.userId),
    userIdNameIdx: index("decks_user_id_name_idx").on(t.userId, t.name),
  }),
);

// Individual flashcards that belong to a deck
export const cards = pgTable(
  "cards",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    deckId: integer()
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),

    // Card ordering within a deck (lower comes first)
    position: integer().notNull().default(0),

    // Front of the card (prompt/question/term), e.g. "Dog" or "When was the battle of Hastings?"
    front: text().notNull(),

    // Back of the card (answer/definition/translation), e.g. "Anjing" or "1066"
    back: text().notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    deckIdIdx: index("cards_deck_id_idx").on(t.deckId),
    deckIdPositionIdx: index("cards_deck_id_position_idx").on(
      t.deckId,
      t.position,
    ),
  }),
);

