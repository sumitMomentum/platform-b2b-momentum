import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjust the import according to your Prisma client setup

export async function GET() {
  try {
    const chargers = await prisma.chargerMaster.findMany(); // Adjust the model name according to your schema
    console.log(chargers);
    return NextResponse.json([
      {
        id: 8,
        chargerID: 518652,
        chargerLocation: "12.80,77.71",
        chargerStatus: "Active",
        dateJoining: "2023-02-26T00:00:00.000Z",
        chargeType: "Normal Charging",
        chargingPoint: "BEVC-DC001",
      },
    ]);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
import { json } from "stream/consumers";
