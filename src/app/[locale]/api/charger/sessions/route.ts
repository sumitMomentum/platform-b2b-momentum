import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const sessions = await prisma.chargingSession.findMany({
      orderBy: {
        DteStart: "desc",
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching charging sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch charging sessions" },
      { status: 500 }
    );
  }
}
