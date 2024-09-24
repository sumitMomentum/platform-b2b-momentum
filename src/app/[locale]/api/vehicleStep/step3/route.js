import { NextResponse } from 'next/server';
var Step2 = require('@/models/step2.js');
var Step3 = require('@/models/step3.js');
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  await connectToDatabase();
  try {
    const allVehicleIds = await Step2.distinct('vehicleId');
    const vehicles = await Step3.aggregate([
      { $match: { vehicleId: { $in: allVehicleIds } } },
      { $group: { _id: '$vehicleId', data: { $push: '$$ROOT' } } },
      { $project: { _id: 0, vehicleId: '$_id', data: { $slice: ['$data', 5] } } },
    ]);

    if (!vehicles.length) {
      return NextResponse.json({ error: 'No vehicles found in Step3' }, { status: 404 });
    }

    const flattenedVehicles = vehicles.flatMap((v) => v.data);
    flattenedVehicles.sort((a, b) => new Date(b.ClosedDateTime) - new Date(a.ClosedDateTime));

    return NextResponse.json(flattenedVehicles);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
import { data } from 'autoprefixer';
import { error } from 'console';
import { json } from 'stream/consumers';
