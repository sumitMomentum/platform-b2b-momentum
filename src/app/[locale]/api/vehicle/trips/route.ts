import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import chalk from "chalk";

export async function GET() {
  try {
    const tripSessions = await prisma.vehicleTripSession.findMany({
      orderBy: {
        startTime: "desc",
      },
    });

    console.log(chalk.blue("Returning Vehicle Trip Sessions"));
    return NextResponse.json(tripSessions);
  } catch (error) {
    console.error(chalk.red("Error fetching trip sessions:"), error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Add route to get trips for a specific vehicle
export async function POST(request: Request) {
  try {
    const { vehicleId } = await request.json();

    if (!vehicleId) {
      return NextResponse.json(
        { message: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    const vehicleTrips = await prisma.vehicleTripSession.findMany({
      where: {
        vehicleId: vehicleId,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    console.log(chalk.blue(`Returning trips for vehicle ${vehicleId}`));
    return NextResponse.json(vehicleTrips);
  } catch (error) {
    console.error(chalk.red("Error fetching vehicle trips:"), error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
import { log } from "console";
import { json } from "stream/consumers";
import { blue, red } from "tailwindcss/colors";
