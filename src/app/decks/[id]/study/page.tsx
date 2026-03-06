import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { cards, decks } from "@/db/schema";
import { StudySession } from "@/components/StudySession";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  // Verify deck exists and belongs to user
  const [deck] = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, id), eq(decks.userId, userId)))
    .limit(1);

  if (!deck) {
    notFound();
  }

  // Get all cards for this deck
  const deckCards = await db
    .select()
    .from(cards)
    .where(eq(cards.deckId, id))
    .orderBy(cards.createdAt);

  return (
    <StudySession 
      cards={deckCards}
      deckId={id}
      deckName={deck.name}
    />
  );
}
