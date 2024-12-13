"use server";
import prisma from "@/lib/db";
import csv from "csv-parser";
import { Readable } from "stream";
import { getAggregatedActions } from "@/utils/actionCapture"; // Adjust the import path if necessary
import { updateBenefits } from "@/utils/demoBenefit"; // Adjust the import path as needed

export async function uploadChargingSessionsFromCSV(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const results: any[] = [];

    // Convert the file buffer into a readable stream
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(fileBuffer);
    readableStream.push(null);

    // Parse CSV
    await new Promise<void>((resolve, reject) => {
      readableStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    // Function to convert date string to Date object or set a default date
    const parseDate = (dateString: string) => {
      if (!dateString) {
        return new Date("2000-01-01");
      }
      const dateObject = new Date(dateString);
      return isNaN(dateObject.getTime()) ? new Date("2000-01-01") : dateObject;
    };

    const demoChargingSessions = await Promise.all(
      results.map(async (row) => {
        return await prisma.chargingSession.create({
          data: {
            TripID: row.TripID ? parseFloat(row.TripID) : undefined,
            DteStart: row.DteStart ? parseInt(row.DteStart) : undefined,
            DteEnd: row.DteEnd ? parseInt(row.DteEnd) : undefined,
            BatteryAtStart: row.BatteryAtStart ? parseInt(row.BatteryAtStart) : undefined,
            BatteryAtEnd: row.BatteryAtEnd ? parseInt(row.BatteryAtEnd) : undefined,
            DiffInBat: row.DiffInBat ? parseInt(row.DiffInBat) : undefined,
            DiffInDte: row.DiffInDte ? parseInt(row.DiffInDte) : undefined,
            DwUpdated: row.DwUpdated ? parseDate(row.DwUpdated) : undefined,
            updatedAt: row.updatedAt ? parseDate(row.updatedAt) : undefined,
            ChargingType: row.ChargingType ? row.ChargingType : undefined,
            vehicleId: row.vehicleId ? row.vehicleId : null,
            chargerId: row.chargerId ? parseInt(row.chargerId) : undefined,
          },
        });
      })
    );

    // Run getAggregatedActions
    const actions = await getAggregatedActions();
    // console.log("[SERVER] Aggregated Actions:", actions);

    // Run updateBenefits function
    const benefitResults = await updateBenefits(demoChargingSessions);
    console.log("[SERVER] Benefit Results:", benefitResults);

    return {
      message: `Successfully uploaded ${demoChargingSessions.length} demo charging sessions, ran aggregated actions, and calculated benefits.`,
      demoChargingSessions,
      actions,
      benefitResults,
    };
  } catch (error) {
    console.error("Error uploading demo charging sessions:", error);
    throw new Error(error.message || "Failed to upload demo charging sessions");
  }
}
