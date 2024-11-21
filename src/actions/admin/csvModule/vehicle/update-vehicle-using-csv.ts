'use server';
import prisma from "@/lib/db";
import csv from 'csv-parser';
import { Readable } from 'stream';
import { updateBenefits } from "@/utils/calculateBenefits";

export async function updateVehiclesFromCSV(formData: FormData) {
  try {
    console.log("Starting vehicle updates from CSV...");

    // Retrieve the uploaded file
    const file = formData.get('file') as File;
    if (!file) {
      console.error("No file provided in the form data.");
      throw new Error('No file provided');
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
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', (error) => {
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
      const dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      return isNaN(dateObject.getTime()) ? new Date("2000-01-01") : dateObject;
    };

    // Process and update vehicles
    console.log("Starting vehicle updates...");
    const updates = await Promise.all(
      results.map(async (row) => {
        try {
          const updatedVehicle = await prisma.vehicle.update({
            where: { id: row.id },
            data: {
              vin: row.vin,
              vehicleId: row.vehicleId,
              model: row.model,
              year: parseInt(row.year),
              batteryCapacity: parseInt(row.batteryCapacity),
              soc: parseInt(row.soc),
              dateOfConnection: parseDate(row.dateOfConnection),
              make: row.make,
              ownerID: row.ownerID,
              odometerFloat: parseFloat(row.odometerFloat),
              UsageAverageDailyKmDriven: parseFloat(row.UsageAverageDailyKmDriven),
              MonthlyUsage: parseFloat(row.MonthlyUsage),
              condition: row.condition,
              status: row.status,
              batteryHealthSoH: parseFloat(row.batteryHealthSoH),
              batteryHealthDegradation: parseFloat(row.batteryHealthDegradation),
              location: row.location,
              soh: parseFloat(row.soh),
              BatteryHealthAverageEstimatedDegradation: parseFloat(row.BatteryHealthAverageEstimatedDegradation),
              BatteryHealthAverageSoC: parseFloat(row.BatteryHealthAverageSoC),
              BatteryHealthTotalBatteries: parseInt(row.BatteryHealthTotalBatteries),
              ConnectorType: row.ConnectorType,
              EndofLife: row.EndofLife,
              RealRangeObserved: parseFloat(row.RealRangeObserved),
              RemainingUsefulLife: parseFloat(row.RemainingUsefulLife),
              TotalChargingSession: parseInt(row.TotalChargingSession),
              TotalEnergyConsumed: parseFloat(row.TotalEnergyConsumed),
              VehicleConditionCritical: parseInt(row.VehicleConditionCritical),
              VehicleConditionGood: parseInt(row.VehicleConditionGood),
              VehicleConditionSatisfactory: parseInt(row.VehicleConditionSatisfactory),
              VehicleStatusActive: row.VehicleStatusActive,
              VehicleStatusCharging: row.VehicleStatusCharging,
              VehicleStatusInUse: row.VehicleStatusInUse,
              VehicleStatusOutofService: row.VehicleStatusOutofService,
              EPAWLTPProvidedRange: parseFloat(row.EPAWLTPProvidedRange),
              UsageRangeObservedMax: parseFloat(row.UsageRangeObservedMax),
              UsageRangeObservedMin: parseFloat(row.UsageRangeObservedMin),
              UsageSoCRangeMax: parseFloat(row.UsageSoCRangeMax),
              UsageSoCRangeMin: parseFloat(row.UsageSoCRangeMin),
              UsageTemperatureHigh: parseFloat(row.UsageTemperatureHigh),
              UsageTemperatureLow: parseFloat(row.UsageTemperatureLow),
              batteryChemistry: row.batteryChemistry,
              BatteryHealthAverageSoH: parseFloat(row.BatteryHealthAverageSoH),
              DataPointsCollected: parseInt(row.DataPointsCollected),
              averageMonthlyUsage: parseFloat(row.averageMonthlyUsage),
              ownerId: row.ownerId,
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
    console.error('Error updating vehicles from CSV:', error);
    throw new Error(error.message || 'Failed to update vehicles');
  }
}
