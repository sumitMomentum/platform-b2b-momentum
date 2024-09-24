import { NextResponse } from 'next/server';
var Step2 = require('@/models/step2.js');
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  await connectToDatabase();
  try {
    const vehicles = await Step2.find();
    if (!vehicles.length) {
      return NextResponse.json({ error: 'No vehicles found in Step2' }, { status: 404 });
    }
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
