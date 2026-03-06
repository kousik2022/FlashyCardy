import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Decks: each user (Clerk) can create decks, e.g. "Indonesian from English" or "British History"
export const decks = pgTable(
  "decks",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Clerk user ID – ownership comes from auth, no users table
    userId: varchar("user_id", { length: 255 }).notNull(),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    userIdIdx: index("decks_user_id_idx").on(t.userId),
    userIdNameIdx: index("decks_user_id_name_idx").on(t.userId, t.name),
  })
);

// Cards: each deck has many cards with front/back content
// e.g. front: "Dog", back: "Anjing" | front: "When was the battle of Hastings?", back: "1066"
export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    deckId: uuid("deck_id")
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),

    position: integer("position").notNull().default(0),

    // Front: prompt, question, or term (e.g. "Dog", "When was the battle of Hastings?")
    front: text("front").notNull(),

    // Back: answer, definition, or translation (e.g. "Anjing", "1066")
    back: text("back").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    deckIdIdx: index("cards_deck_id_idx").on(t.deckId),
    deckIdPositionIdx: index("cards_deck_id_position_idx").on(
      t.deckId,
      t.position
    ),
  })
);
