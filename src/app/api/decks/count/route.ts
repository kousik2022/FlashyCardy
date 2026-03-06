import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decks } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [deckCount] = await db
      .select({ count: count() })
      .from(decks)
      .where(eq(decks.userId, userId));

    return NextResponse.json({ count: deckCount.count });
  } catch (error) {
    console.error("Error fetching deck count:", error);
    return NextResponse.json(
      { error: "Failed to fetch deck count" },
      { status: 500 }
    );
  }
}
