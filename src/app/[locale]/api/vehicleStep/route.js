// src/app/api/your-endpoint/route.js
import { NextResponse } from "next/server";
var vehicleDetails = require('@/models/vehicleDetails.js');
var Step1 = require('@/models/step1.js');
var Step2 = require('@/models/step2.js');
var Step3 = require('@/models/step3.js');
var Step7 = require('@/models/step7.js');

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get("vehicleId");
  const stepID = searchParams.get("step");

  if (!vehicleId || !stepID) {
    return NextResponse.json(
      { error: "Missing vehicleId or step query parameters" },
      { status: 400 }
    );
  }

  let data;
  let Model;

  try {
    switch (stepID) {
      case "1":
        Model = Step1;
        break;
      case "2":
        Model = Step2;
        break;
      case "3":
        Model = Step3;
        break;
      case "7":
        Model = Step7;
        break;
      case "details":
        Model = vehicleDetails;
        break;
      default:
        return NextResponse.json({ error: "Invalid step ID" }, { status: 400 });
    }

    data = await Model.find({ vehicleId });

    if (!data.length) {
      return NextResponse.json(
        { error: "No data found for this vehicle and step" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
