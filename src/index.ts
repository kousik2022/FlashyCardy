import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { cards, decks } from "./db/schema";

async function main() {
  const deckToCreate: typeof decks.$inferInsert = {
    userId: "seed_user",
    name: "Seed deck",
    description: "Created by `npm run db:seed`",
  };

  const [createdDeck] = await db
    .insert(decks)
    .values(deckToCreate)
    .returning({ id: decks.id });

  if (!createdDeck) {
    throw new Error("Failed to create deck");
  }

  const cardToCreate: typeof cards.$inferInsert = {
    deckId: createdDeck.id,
    front: "Hello",
    back: "World",
  };

  const [createdCard] = await db
    .insert(cards)
    .values(cardToCreate)
    .returning({ id: cards.id });

  console.log("Created deck id:", createdDeck.id);
  console.log("Created card id:", createdCard?.id);

  const allDecks = await db.select().from(decks).limit(10);
  console.log("Decks:", allDecks);

  const deckCards = await db
    .select()
    .from(cards)
    .where(eq(cards.deckId, createdDeck.id))
    .limit(10);
  console.log("Cards in created deck:", deckCards);

  // Cleanup so repeated seeds don't bloat the DB
  await db.delete(decks).where(eq(decks.id, createdDeck.id));
  console.log("Cleanup complete (deleted created deck + cascade cards).");
}

main().catch((err) => {
  console.error("Error in seed script:", err);
  process.exit(1);
});

