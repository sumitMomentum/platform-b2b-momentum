"use server";
import prisma from "@/lib/db";
import csv from "csv-parser";
import { Readable } from "stream";
import { updateBenefits } from "@/utils/calculateBenefits";

export async function uploadVehiclesFromCSV(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const results: any[] = [];

    // Parse CSV
    await new Promise((resolve, reject) => {
      Readable.from(fileBuffer)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    const parseDate = (dateString: string) => {
      return dateString ? new Date(dateString) : new Date(); // Default to current date if null
    };

    const parseArrayOrSingleFloat = (value: string) => {
      if (!value) {
        return [];
      }
      const values = value.split(",").map((item) => parseFloat(item.trim()));
      return values.length === 1 ? values[0] : values;
    };

    const parseSingleFloat = (value: string) => {
      return value ? parseFloat(value) : null;
    };

    const ensureArray = (value: any) => {
      return value !== null && !Array.isArray(value) ? [value] : value;
    };

    const vehicles = await Promise.all(
      results.map(async (row) => {
        return await prisma.vehicle.create({
          data: {
            id: row.id || "",
            vin: row.vin || "",
            vehicleId: row.vehicleId || "",
            model: row.model || "",
            year: row.year ? parseInt(row.year) : null,
            batteryCapacity: row.batteryCapacity ? parseInt(row.batteryCapacity) : null,
            ownerID: row.ownerID ? parseInt(row.ownerID) : 1, // Default to 1 if ownerID is not provided
            soc: row.soc ? parseInt(row.soc) : null,
            dateOfConnection: parseDate(row.dateOfConnection), // Ensure dateOfConnection is not null
            odometerFloat: row.odometerFloat ? parseFloat(row.odometerFloat) : null,
            usageAverageDailyKmDriven: parseArrayOrSingleFloat(row.UsageAverageDailyKmDriven),
            monthlyUsage: parseArrayOrSingleFloat(row.MonthlyUsage),
            condition: row.condition || "",
            status: row.status || "",
            make: row.make || "",
            batteryHealthSoH: row.batteryHealthSoH ? parseFloat(row.batteryHealthSoH) : null,
            batteryHealthDegradation: row.batteryHealthDegradation ? parseFloat(row.batteryHealthDegradation) : null,
            location: row.location || "",
            soh: ensureArray(parseArrayOrSingleFloat(row.soh)),
            batteryHealthAverageEstimatedDegradation: ensureArray(parseArrayOrSingleFloat(row.BatteryHealthAverageEstimatedDegradation)),
            batteryHealthAverageSoC: parseSingleFloat(row.BatteryHealthAverageSoC),
            batteryHealthTotalBatteries: row.BatteryHealthTotalBatteries ? parseInt(row.BatteryHealthTotalBatteries) : null,
            connectorType: row.ConnectorType || "",
            endOfLife: row.EndofLife || "",
            realRangeObserved: row.RealRangeObserved ? parseFloat(row.RealRangeObserved) : null,
            remainingUsefulLife: row.RemainingUsefulLife ? row.RemainingUsefulLife.toString() : null, // Ensuring string type
            totalChargingSession: row.TotalChargingSession ? parseInt(row.TotalChargingSession) : null,
            totalEnergyConsumed: row.TotalEnergyConsumed || "",
            vehicleConditionCritical: row.VehicleConditionCritical ? parseInt(row.VehicleConditionCritical) : null,
            vehicleConditionGood: row.VehicleConditionGood ? parseInt(row.VehicleConditionGood) : null,
            vehicleConditionSatisfactory: row.VehicleConditionSatisfactory ? parseInt(row.VehicleConditionSatisfactory) : null,
            vehicleStatusActive: row.VehicleStatusActive ? parseInt(row.VehicleStatusActive) : null,
            vehicleStatusCharging: row.VehicleStatusCharging ? parseInt(row.VehicleStatusCharging) : null,
            vehicleStatusInUse: row.VehicleStatusInUse ? parseInt(row.VehicleStatusInUse) : null,
            vehicleStatusOutOfService: row.VehicleStatusOutofService ? parseInt(row.VehicleStatusOutofService) : null,
            epawltpProvidedRange: row.EPAWLTPProvidedRange ? parseInt(row.EPAWLTPProvidedRange) : null,
            usageRangeObservedMax: row.UsageRangeObservedMax ? parseInt(row.UsageRangeObservedMax) : null,
            usageRangeObservedMin: row.UsageRangeObservedMin ? parseInt(row.UsageRangeObservedMin) : null,
            usageSoCRangeMax: row.UsageSoCRangeMax ? parseInt(row.UsageSoCRangeMax) : null,
            usageSoCRangeMin: row.UsageSoCRangeMin ? parseInt(row.UsageSoCRangeMin) : null,
            usageTemperatureHigh: row.UsageTemperatureHigh ? parseInt(row.UsageTemperatureHigh) : null,
            usageTemperatureLow: row.UsageTemperatureLow ? parseInt(row.UsageTemperatureLow) : null,
            batteryChemistry: row.batteryChemistry || "",
            batteryHealthAverageSoH: row.BatteryHealthAverageSoH ? parseFloat(row.BatteryHealthAverageSoH) : null,
            dataPointsCollected: row.DataPointsCollected ? parseInt(row.DataPointsCollected) : null,
            averageMonthlyUsage: row.averageMonthlyUsage ? parseFloat(row.averageMonthlyUsage) : null,
            owner: { // Associate with the owner
              connectOrCreate: {
                where: { id: row.ownerID ? parseInt(row.ownerID) : 1 },
                create: { id: row.ownerID ? parseInt(row.ownerID) : 1 }
              }
            }
          },
        });
      })
    );

    const benefits = await updateBenefits();

    return {
      message: `Successfully uploaded ${vehicles.length} vehicles and updated benefits for ${benefits.length} vehicles.`,
      vehicles,
      benefits,
    };
  } catch (error) {
    console.error("Error uploading vehicles:", error);
    throw new Error(
      error.message || "Failed to upload vehicles and update benefits"
    );
  }
}
