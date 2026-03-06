import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq, max } from "drizzle-orm";
import { db } from "@/db";
import { cards, decks } from "@/db/schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id: deckId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the deck exists and belongs to the user
    const [deck] = await db
      .select()
      .from(decks)
      .where(and(eq(decks.id, deckId), eq(decks.userId, userId)))
      .limit(1);

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const body = await request.json();
    const { front, back } = body;

    if (!front || typeof front !== "string" || front.trim().length === 0) {
      return NextResponse.json({ error: "Front content is required" }, { status: 400 });
    }

    if (!back || typeof back !== "string" || back.trim().length === 0) {
      return NextResponse.json({ error: "Back content is required" }, { status: 400 });
    }

    // Get the next position for this card
    const [maxPosition] = await db
      .select({ max: max(cards.position) })
      .from(cards)
      .where(eq(cards.deckId, deckId));

    const nextPosition = (maxPosition?.max ?? 0) + 1;

    const [newCard] = await db
      .insert(cards)
      .values({
        deckId,
        position: nextPosition,
        front: front.trim(),
        back: back.trim(),
      })
      .returning();

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}
