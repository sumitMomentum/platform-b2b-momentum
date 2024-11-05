import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import chalk from "chalk"; // Move imports to top
import { auth } from "@clerk/nextjs";
import { error } from "console";
import { json } from "stream/consumers";

export async function GET(
  request: Request,
  { params }: { params: { vehicleId: string } }
) {
  const { vehicleId } = params;
  console.log(chalk.red("API Route hit with vehicleId:", vehicleId));

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicleId: vehicleId },
    });

    if (!vehicle) {
      console.log(chalk.yellow("Vehicle not found"));
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 }
      );
    }

    console.log(chalk.green("Vehicle found:", vehicle));
    return NextResponse.json(vehicle);
  } catch (error) {
    console.log(chalk.red("Error:", error));
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
