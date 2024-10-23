import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const vehicleActions = await prisma.action.findMany(); // Ensure 'vehicleAction' matches your schema model
    console.log()
    return NextResponse.json(vehicleActions);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
import { json } from "stream/consumers";
