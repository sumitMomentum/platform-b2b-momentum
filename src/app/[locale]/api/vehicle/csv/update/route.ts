import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import csv from "csv-parser";
import { Readable } from "stream";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const results: any[] = [];

    const parseNumberArray = (numArrayString: string) => {
      return numArrayString ? numArrayString.split(",").map(parseFloat) : [];
    };

    const convertOwnerId = (_ownerId: string | number) => {
      return 1; // Always set ownerId to 1
    };

    const parseDate = (dateString: string) => {
      if (!dateString) {
        return new Date("2000-01-01"); // Default date if dateString is undefined
      }

      const dateParts = dateString.split("-");
      const dateObject = new Date(
        parseInt(dateParts[2], 10), // Year
        parseInt(dateParts[1], 10) - 1, // Month (0-based)
        parseInt(dateParts[0], 10) // Day
      );
      return isNaN(dateObject.getTime()) ? new Date("2000-01-01") : dateObject;
    };
    // Parse CSV
    await new Promise((resolve, reject) => {
      Readable.from(fileBuffer)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    // Process and update vehicles
    const updates = await Promise.all(
      results.map(async (row) => {
        return await prisma.vehicle.update({
          where: {
            id: row.id,
          },
          data: {
            id: row.id,
            vin: row.vin,
            vehicleId: row.vehicleId,
            model: row.model,
            year: parseInt(row.year),
            batteryCapacity: parseInt(row.batteryCapacity),
            ownerID: convertOwnerId(row.ownerID),
            soc: parseInt(row.soc),
            dateOfConnection: parseDate(row.dateOfConnection),
            odometerFloat: parseFloat(row.odometerReading),
            // avgDailyKmDriven: row.avgDailyKmDriven ? row.avgDailyKmDriven.split(',').map(parseFloat) : [],
            monthlyUsage: row.monthlyUsage ? row.monthlyUsage.split(',').map(parseFloat) : [],
            condition: row.condition,
            status: row.status,
            make: row.make,
            batteryHealthSoH: parseFloat(row.batteryHealthSoH),
            batteryHealthDegradation: parseFloat(row.batteryHealthDegradation),
            location: row.location,
            soh: row.soh ? row.soh.split(",").map(parseFloat) : [],
            avgEstimatedDegradation: row.avgEstimatedDegradation
              ? row.avgEstimatedDegradation.split(",").map(parseFloat)
              : [],
            avgSoC: parseFloat(row.avgSoC),
            totalBatteries: parseInt(row.totalBatteries),
            connectorType: row.connectorType,
            endOfLifeEstimate: row.endOfLifeEstimate,
            observedRange: parseInt(row.observedRange),
            remainingUsefulLife: row.remainingUsefulLife,
            totalChargingSessions: parseInt(row.totalChargingSessions),
            totalEnergyConsumed: row.totalEnergyConsumed,
            criticalConditionCount: parseInt(row.criticalConditionCount),
            goodConditionCount: parseInt(row.goodConditionCount),
            satisfactoryConditionCount: parseInt(
              row.satisfactoryConditionCount
            ),
            activeStatusCount: parseInt(row.activeStatusCount),
            chargingStatusCount: parseInt(row.chargingStatusCount),
            inUseStatusCount: parseInt(row.inUseStatusCount),
            outOfServiceStatusCount: parseInt(row.outOfServiceStatusCount),
            providedRangeEPAWLTP: parseInt(row.providedRangeEPAWLTP),
            maxObservedRange: parseInt(row.maxObservedRange),
            minObservedRange: parseInt(row.minObservedRange),
            maxSoCRange: parseInt(row.maxSoCRange),
            minSoCRange: parseInt(row.minSoCRange),
            maxTemperature: parseInt(row.maxTemperature),
            minTemperature: parseInt(row.minTemperature),
            batteryChemistry: row.batteryChemistry,
            avgBatteryHealthSoH: parseFloat(row.avgBatteryHealthSoH),
            dataPointsCollected: parseInt(row.dataPointsCollected),
            avgMonthlyUsage: parseFloat(row.avgMonthlyUsage),
            vehicleConditionCritical: parseInt(row.vehicleConditionCritical),
            vehicleConditionGood: parseInt(row.vehicleConditionGood),
            vehicleConditionSatisfactory: parseInt(
              row.vehicleConditionSatisfactory
            ),
            vehicleStatusActive: parseInt(row.vehicleStatusActive),
            vehicleStatusCharging: parseInt(row.vehicleStatusCharging),
            vehicleStatusInUse: parseInt(row.vehicleStatusInUse),
            vehicleStatusOutOfService: parseInt(row.vehicleStatusOutOfService),
            averageMonthlyUsage: parseFloat(row.averageMonthlyUsage),
            batteryHealthAverageEstimatedDegradation:
              row.batteryHealthAverageEstimatedDegradation
                ? row.batteryHealthAverageEstimatedDegradation
                    .split(",")
                    .map(parseFloat)
                : [],
            batteryHealthAverageSoC: parseFloat(row.batteryHealthAverageSoC),
            batteryHealthAverageSoH: parseFloat(row.batteryHealthAverageSoH),
            batteryHealthTotalBatteries: parseInt(
              row.batteryHealthTotalBatteries
            ),
            endOfLife: row.endOfLife,
            epawltpProvidedRange: parseInt(row.epawltpProvidedRange),
            // odometerFloat: parseFloat(row.odometerFloat),
            realRangeObserved: parseInt(row.realRangeObserved),
            totalChargingSession: parseInt(row.totalChargingSession),
            // usageAverageDailyKmDriven: row.usageAverageDailyKmDriven ? row.usageAverageDailyKmDriven.split(',').map(parseFloat) : [],
            usageRangeObservedMax: parseInt(row.usageRangeObservedMax),
            usageRangeObservedMin: parseInt(row.usageRangeObservedMin),
            usageSoCRangeMax: parseInt(row.usageSoCRangeMax),
            usageSoCRangeMin: parseInt(row.usageSoCRangeMin),
            usageTemperatureHigh: parseInt(row.usageTemperatureHigh),
            usageTemperatureLow: parseInt(row.usageTemperatureLow),
            ownerId: convertOwnerId(row.ownerId),
          },
        });
      })
    );

    return NextResponse.json({
      message: `Successfully updated ${updates.length} vehicles`,
      updates,
    });
  } catch (error: any) {
    console.error("Error processing update:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
