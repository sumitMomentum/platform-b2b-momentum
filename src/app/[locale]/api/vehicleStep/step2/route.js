import { NextResponse } from 'next/server';
import Step2 from '@/models/step2';
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
