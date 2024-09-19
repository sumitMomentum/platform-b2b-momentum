import { NextResponse } from "next/server";
import ChargerTypes from "@/models/chargerTypes";
import ChargerMaster from "@/models/chargerMaster";
import {vehiclesChargingDetails} from "@/models/vehicleChargingDetails.js";
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
