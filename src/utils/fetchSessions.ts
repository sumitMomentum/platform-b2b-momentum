"use server";
import prisma from "@/lib/db";
import { data as chargingSessionsData } from './seeds/chargingSessions'; // Import data from chargingSessions.ts
import { data as vehicleTripSessionsData } from './seeds/vehicleTripSessions'; // Import data from vehicleTripSessions.ts

export const insertSessions = async () => {
  try {
    // Step 1: Fetch all vehicleIds from the vehicle table
    const vehicles = await prisma.vehicle.findMany({
      select: { vehicleId: true } // Fetching only `vehicleId`
    });

    // Step 2: Insert charging sessions
    for (const chargingSessionData of chargingSessionsData) {
      const vehicleExists = vehicles.some(vehicle => vehicle.vehicleId === chargingSessionData.vehicleId);
      if (vehicleExists) {
        await prisma.chargingSession.create({
          data: {
            TripID: chargingSessionData.TripID,
            DteStart: chargingSessionData.DteStart,
            DteEnd: chargingSessionData.DteEnd,
            BatteryAtStart: chargingSessionData.BatteryAtStart,
            BatteryAtEnd: chargingSessionData.BatteryAtEnd,
            DwUpdated: chargingSessionData.DwUpdated,
            DiffInBat: chargingSessionData.DiffInBat,
            ChargingType: chargingSessionData.ChargingType,
            DiffInDte: chargingSessionData.DiffInDte,
            vehicleId: chargingSessionData.vehicleId, // Use the vehicleId directly
            chargerId: chargingSessionData.chargerId
          }
        });
        console.log(`Charging session for vehicleId ${chargingSessionData.vehicleId} inserted successfully.`);
      } else {
        console.log(`Vehicle with vehicleId ${chargingSessionData.vehicleId} not found.`);
      }
    }

    // Step 3: Insert vehicle trip sessions
    for (const vehicleTripSessionData of vehicleTripSessionsData) {
      const vehicleExists = vehicles.some(vehicle => vehicle.vehicleId === vehicleTripSessionData.vehicleId);
      if (vehicleExists) {
        await prisma.vehicleTripSession.create({
          data: {
            TripID: vehicleTripSessionData.TripID,
            DteStart: vehicleTripSessionData.DteStart,
            DteEnd: vehicleTripSessionData.DteEnd,
            BatteryAtStart: vehicleTripSessionData.BatteryAtStart,
            BatteryAtEnd: vehicleTripSessionData.BatteryAtEnd,
            DwUpdated: vehicleTripSessionData.DwUpdated,
            TripApprovedKilometer: vehicleTripSessionData.TripApprovedKilometer,
            DiffInBat: vehicleTripSessionData.DiffInBat,
            DiffInDte: vehicleTripSessionData.DiffInDte,
            vehicleId: vehicleTripSessionData.vehicleId // Use the vehicleId directly
          }
        });
        console.log(`Vehicle trip session for vehicleId ${vehicleTripSessionData.vehicleId} inserted successfully.`);
      } else {
        console.log(`Vehicle with vehicleId ${vehicleTripSessionData.vehicleId} not found.`);
      }
    }

    return { message: "Charging sessions and vehicle trip sessions inserted successfully." };
  } catch (error) {
    console.error("Error inserting charging sessions and vehicle trip sessions:", error);
    throw new Error("An error occurred while inserting charging sessions and vehicle trip sessions.");
  }
};