// app/api/vehicle/allVehicleDetails/route.js
import { NextResponse } from 'next/server';
import VehicleDetails from '@/models/vehicleDetails';
import { connectToDatabase } from '@/lib/mongodb';

// Route to get all vehicle details
export async function GET(req) {
  await connectToDatabase();
  
  try {
    const vehicles = await VehicleDetails.find();

    if (!vehicles.length) {
      return NextResponse.json({ error: "No vehicles found in VehicleDetails" }, { status: 404 });
    }

    return NextResponse.json(vehicles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
