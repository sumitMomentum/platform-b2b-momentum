import { NextResponse } from 'next/server';

var VehicleDetails = require('@/models/vehicleDetails.js');
var Step1 = require('@/models/step1.js');
var Step2 = require('@/models/step2.js');
var Step3 = require('@/models/step3.js');
var Step7 = require('@/models/step7.js');
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req) {
  await connectToDatabase();
  const url = new URL(req.url);
  const stepId = url.searchParams.get('stepId');
  const vehicleId = url.searchParams.get('vehicleId');

  if (!vehicleId || !stepId) {
    return NextResponse.json({ error: 'Missing vehicleId or stepId query parameters' }, { status: 400 });
  }

  let Model;
  switch (stepId) {
    case '1':
      Model = Step1;
      break;
    case '2':
      Model = Step2;
      break;
    case '3':
      Model = Step3;
      break;
    case '7':
      Model = Step7;
      break;
    case 'details':
      Model = VehicleDetails;
      break;
    default:
      return NextResponse.json({ error: 'Invalid step ID' }, { status: 400 });
  }

  const data = await Model.find({ vehicleId });
  if (!data.length) {
    return NextResponse.json({ error: 'No data found for this vehicle and step' }, { status: 404 });
  }

  return NextResponse.json(data);
}
import { error } from 'console';
import { get } from 'http';
import { json } from 'stream/consumers';
