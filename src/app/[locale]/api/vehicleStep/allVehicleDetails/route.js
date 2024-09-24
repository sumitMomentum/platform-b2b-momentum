import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

var VehicleDetails = require('@/models/vehicleDetails.js');
// Route to get all vehicle details
export async function GET() {
  await connectToDatabase();
  
  try {
    const vehicles = await VehicleDetails.find();
    //console.log(vehicles);
    if (!vehicles.length) {
      return NextResponse.json({ error: "No vehicles found in VehicleDetails" }, { status: 404 });
    }

    return NextResponse.json(vehicles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
