import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
var Step7 = require('@/models/step7.js');

export async function GET() {
  await connectToDatabase();

  try {
    const vehicles = await Step7.find();

    if (!vehicles.length) {
      return NextResponse.json({ error: 'No vehicles found in Step7' }, { status: 404 });
    }

    return NextResponse.json(vehicles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
import { error } from 'console';
import { json } from 'stream/consumers';
