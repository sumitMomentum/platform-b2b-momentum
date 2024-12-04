"use server";
import prisma from "@/lib/db";
import csv from "csv-parser";
import { Readable } from "stream";
import { updateBenefits } from "@/utils/calculateBenefits";

export async function updateVehiclesFromCSV(formData: FormData) {
  try {
    console.log("Starting vehicle updates from CSV...");

    // Retrieve the uploaded file
    const file = formData.get("file") as File;
    if (!file) {
      console.error("No file provided in the form data.");
      throw new Error("No file provided");
    }
    console.log("File received for processing:", file.name);

    // Convert the file to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    console.log("File converted to buffer. Starting CSV parsing...");

    const results: any[] = [];

    // Parse the CSV data
    await new Promise((resolve, reject) => {
      Readable.from(fileBuffer)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", (error) => {
          console.error("Error parsing CSV:", error);
          reject(error);
        });
    });

    console.log(`CSV parsing completed. Parsed ${results.length} rows.`);

    // Function to convert date string to Date object or set a default date
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

    // Function to convert a comma-separated string to an array of numbers
    const parseNumberArray = (numArrayString: string) => {
      return numArrayString ? numArrayString.split(",").map(parseFloat) : [];
    };

    const convertOwnerId = (_ownerId: string | number) => {
      return 1; // Always set ownerId to 1
    };

    // Process and update vehicles
    console.log("Starting vehicle updates...");
    const updates = await Promise.all(
      results.map(async (row) => {
        try {
          const updatedVehicle = await prisma.vehicle.update({
            where: { id: row.id },
            data: {
              id: row.id,
              vin: row.vin,
              vehicleId: row.vehicleId,
              model: row.model,
              year: parseInt(row.year),
              batteryCapacity: parseInt(row.batteryCapacity),
              ownerId: convertOwnerId(row.ownerId), // Ensure correct field name
              soc: parseInt(row.soc),
              dateOfConnection: parseDate(row.dateOfConnection),
              odometerReading: parseFloat(row.odometerReading), // Fixed typo from odometerFloat
              usageAverageDailyKmDriven: parseNumberArray(row.avgDailyKmDriven),
              monthlyUsage: parseNumberArray(row.monthlyUsage),
              condition: row.condition,
              status: row.status,
              make: row.make,
              batteryHealthSoH: parseFloat(row.batteryHealthSoH),
              batteryHealthDegradation: parseFloat(row.batteryHealthDegradation),
              location: row.location,
              soh: parseNumberArray(row.soh),
              avgEstimatedDegradation: parseNumberArray(row.avgEstimatedDegradation),
              avgSoC: parseFloat(row.avgSoC),
              totalBatteries: parseInt(row.totalBatteries),
              connectorType: row.connectorType,
              endOfLifeEstimate: row.endOfLifeEstimate,
              observedRange: parseInt(row.observedRange),
              remainingUsefulLife: row.remainingUsefulLife,
              totalChargingSessions: parseInt(row.totalChargingSessions),
              totalEnergyConsumed: parseInt(row.totalEnergyConsumed),
              criticalConditionCount: parseInt(row.criticalConditionCount),
              goodConditionCount: parseInt(row.goodConditionCount),
              satisfactoryConditionCount: parseInt(row.satisfactoryConditionCount),
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
              vehicleConditionSatisfactory: parseInt(row.vehicleConditionSatisfactory),
              vehicleStatusActive: parseInt(row.vehicleStatusActive),
              vehicleStatusCharging: parseInt(row.vehicleStatusCharging),
              vehicleStatusInUse: parseInt(row.vehicleStatusInUse),
              vehicleStatusOutOfService: parseInt(row.vehicleStatusOutOfService),
              averageMonthlyUsage: parseFloat(row.averageMonthlyUsage),
              batteryHealthAverageEstimatedDegradation: parseNumberArray(row.batteryHealthAverageEstimatedDegradation),
              batteryHealthAverageSoC: parseFloat(row.batteryHealthAverageSoC),
              batteryHealthAverageSoH: parseFloat(row.batteryHealthAverageSoH),
              batteryHealthTotalBatteries: parseInt(row.batteryHealthTotalBatteries),
              endOfLife: row.endOfLife,
              epawltpProvidedRange: parseInt(row.epawltpProvidedRange),
              realRangeObserved: parseInt(row.realRangeObserved),
              totalChargingSession: parseInt(row.totalChargingSession),
              usageRangeObservedMax: parseInt(row.usageRangeObservedMax),
              usageRangeObservedMin: parseInt(row.usageRangeObservedMin),
              usageSoCRangeMax: parseInt(row.usageSoCRangeMax),
              usageSoCRangeMin: parseInt(row.usageSoCRangeMin),
              usageTemperatureHigh: parseInt(row.usageTemperatureHigh),
              usageTemperatureLow: parseInt(row.usageTemperatureLow),
            },
          });
          console.log(`Vehicle updated successfully: ID = ${row.id}`);
          return updatedVehicle;
        } catch (error) {
          console.error(`Error updating vehicle: ID = ${row.id}`, error);
          throw error;
        }
      })
    );

    console.log(`Successfully updated ${updates.length} vehicles.`);

    // Update benefits for all vehicles
    console.log("Updating benefits for all vehicles...");
    await updateBenefits();
    console.log("Benefits update completed.");

    return {
      message: `Successfully updated ${updates.length} vehicles`,
      updates,
    };
  } catch (error) {
    console.error("Error updating vehicles from CSV:", error);
    throw new Error(error.message || "Failed to update vehicles");
  }
}
