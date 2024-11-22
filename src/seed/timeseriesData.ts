import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

type TimeSeriesRow = {
  timestamp: string;
  vehicleId: string;
  vin: string;
  daily_km_driven: string;
  battery_health_soh: string;
  energy_consumed: string;
  revenue_generated: string;
  range_observed: string;
};

export async function seedTimeSeriesDataFromCSV(csvFilePath: string): Promise<void> {
  const timeSeriesData: {
    timestamp: Date;
    vehicleId: string;
    vin: string;
    dailyKmDriven: number;
    batteryHealthSoH: number;
    energyConsumed: number;
    revenueGenerated: number;
    rangeObserved: number;
  }[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row: TimeSeriesRow) => {
        // Convert string values to appropriate data types
        timeSeriesData.push({
          timestamp: new Date(row.timestamp),
          vehicleId: row.vehicleId,
          vin: row.vin,
          dailyKmDriven: parseFloat(row.daily_km_driven),
          batteryHealthSoH: parseFloat(row.battery_health_soh),
          energyConsumed: parseFloat(row.energy_consumed),
          revenueGenerated: parseFloat(row.revenue_generated),
          rangeObserved: parseFloat(row.range_observed),
        });
      })
      .on("end", async () => {
        // Insert the data into the database
        try {
          await prisma.timeSeriesData.createMany({
            data: timeSeriesData,
          });
          console.log("Seeded time series data from CSV");
          resolve();
        } catch (error) {
          console.error("Error seeding time series data:", error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      });
  });
}

// Example usage of the function
(async () => {
  const csvFilePath = path.resolve(__dirname, "./csvData/time_series_data.csv"); 
  try {
    await seedTimeSeriesDataFromCSV(csvFilePath);
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
})();
