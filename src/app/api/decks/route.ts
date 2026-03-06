import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decks } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Deck creation is now unlimited - no limit check needed

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Deck name is required" }, { status: 400 });
    }

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json({ error: "Deck description is required for AI card generation" }, { status: 400 });
    }

    const [newDeck] = await db
      .insert(decks)
      .values({
        userId,
        name: name.trim(),
        description: description.trim(),
      })
      .returning();

    return NextResponse.json(newDeck, { status: 201 });
  } catch (error) {
    console.error("Error creating deck:", error);
    return NextResponse.json(
      { error: "Failed to create deck" },
      { status: 500 }
    );
  }
}
