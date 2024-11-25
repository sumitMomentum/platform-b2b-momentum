import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import chalk from "chalk";

export async function GET() {
  try {
    // console.log(
    //   "API is getting Hit---------------------------------------------------"
    // );
    const vehicles = await prisma.vehicle.findMany(); // Ensure 'vehicle' matches your schema model
    console.log(chalk.blue("Returning Vehicles"));
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
