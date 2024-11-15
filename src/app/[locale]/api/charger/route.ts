import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjust the import based on your Prisma setup

export async function GET() {
  try {
    // Fetch all charging sessions
    const chargingSessions = await prisma.ChargerMaster.findMany();

    // Optionally log the results for debugging
    console.log("Fetched Charging Sessions:", chargingSessions);

    // Return the charging sessions as a response
    return NextResponse.json(chargingSessions);
  } catch (error) {
    // Handle errors and return a failure response
    console.error("Error fetching charging sessions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
