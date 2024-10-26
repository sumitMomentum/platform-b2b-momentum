import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany(); // Ensure 'vehicle' matches your schema model
    console.log("we are here");
    console.log(vehicles);
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
import { json } from "stream/consumers";
