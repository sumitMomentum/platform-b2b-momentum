import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db"; // Adjust the import path as needed

export async function GET(req: NextRequest) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      select: {
        id: true,
        vehicleId: true,
        vin: true,
      },
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json({ error: 'Failed to fetch vehicles', details: error.message }, { status: 500 });
  }
}
