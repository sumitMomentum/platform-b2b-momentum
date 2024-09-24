import { NextResponse } from "next/server";
var ChargerTypes = require('@/models/chargerTypes.js');
var ChargerMaster = require('@/models/chargerMaster.js');
var vehiclesChargingDetails = require('@/models/vehicleChargingDetails.js');

import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req) {
  await connectToDatabase();

  const { pathname } = req.nextUrl;

  try {
    if (pathname.includes("allChargerTypes")) {
      const chargers = await ChargerTypes.find();
      if (!chargers.length) {
        return NextResponse.json(
          { error: "No chargers found" },
          { status: 404 }
        );
      }
      return NextResponse.json(chargers);
    }

    if (pathname.includes("allChargerMaster")) {
      const chargerMasters = await ChargerMaster.find();
      if (!chargerMasters.length) {
        return NextResponse.json(
          { error: "No charger master data found" },
          { status: 404 }
        );
      }
      return NextResponse.json(chargerMasters);
    }

    if (pathname.includes("allVehicleChargingDetails")) {
      const chargingDetails = await vehiclesChargingDetails.find();
      if (!chargingDetails.length) {
        return NextResponse.json(
          { error: "No vehicle charging details found" },
          { status: 404 }
        );
      }
      return NextResponse.json(chargingDetails);
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
