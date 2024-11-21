'use server';
import prisma from "@/lib/db";
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function updateVehiclesFromCSV(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const results: any[] = [];

    // Parse CSV
    await new Promise((resolve, reject) => {
      Readable.from(fileBuffer)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    // Function to convert date string to Date object or set a default date
    const parseDate = (dateString) => {
      if (!dateString) {
        return new Date("2000-01-01"); // Default date if dateString is undefined
      }

      const dateParts = dateString.split("-");
      // Create a new Date object using the parts of the date string
      const dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      return isNaN(dateObject.getTime()) ? new Date("2000-01-01") : dateObject;
    };

    // Process and update vehicles
    const updates = await Promise.all(
      results.map(async (row) => {
        return await prisma.vehicle.update({
          where: {
            id: row.id,
          },
          data: {
            vin: row.vin,
            vehicleId: row.vehicleId,
            model: row.model,
            year: parseInt(row.year),
            batteryCapacity: parseInt(row.batteryCapacity),
            soc: parseInt(row.soc),
            dateOfConnection: parseDate(row.dateOfConnection), // Convert date string to Date object
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
      })
    );

    return {
      message: `Successfully updated ${updates.length} vehicles`,
      updates,
    };
  } catch (error) {
    console.error('Error updating vehicles:', error);
    throw new Error(error.message || 'Failed to update vehicles');
  }
}
