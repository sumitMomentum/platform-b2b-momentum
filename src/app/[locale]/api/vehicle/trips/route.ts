"use server";

import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import chalk from "chalk";

export async function GET() {
  try {
    // Fetching all vehicle trip sessions
    const tripSessions = await prisma.vehicleTripSession.findMany({
      // No limit here, this will fetch all records
      orderBy: {
        DteStart: "desc", // You can adjust the field to order as required
      },
    });

    console.log(chalk.blue("Returning All Vehicle Trip Sessions"));
    return NextResponse.json(tripSessions);
  } catch (error) {
    console.error(chalk.red("Error fetching all trip sessions:"), error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
