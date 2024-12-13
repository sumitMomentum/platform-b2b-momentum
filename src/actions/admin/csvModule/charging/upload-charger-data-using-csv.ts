"use server";
import prisma from "@/lib/db";
import csv from "csv-parser";
import { Readable } from "stream";
import { getAggregatedActions } from "@/utils/actionCapture"; // Adjust the import path if necessary

export async function uploadChargerDataFromCSV(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const results: any[] = [];

    // Convert the file buffer into a readable stream correctly
    const readableStream = new Readable();
    readableStream._read = () => {}; // _read is required but you can noop it
    readableStream.push(fileBuffer);
    readableStream.push(null);

    // Parse CSV
    await new Promise((resolve, reject) => {
      readableStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    // Function to convert date string to Date object or set a default date
    const parseDate = (dateString: string) => {
      if (!dateString) {
        return new Date("2000-01-01"); // Default date if dateString is undefined
      }

      const dateObject = new Date(dateString);
      return isNaN(dateObject.getTime()) ? new Date("2000-01-01") : dateObject;
    };

    // Process and insert charger data
    const chargerData = await Promise.all(
      results.map(async (row) => {
        return await prisma.chargerMaster.create({
          data: {
            chargerId: row.chargerID ? parseInt(row.chargerID) : undefined,
            chargerLocation: row.chargerLocation,
            chargerStatus: row.chargerStatus,
            dateJoining: row.dateJoining ? parseDate(row.dateJoining) : undefined,
            chargeType: row.chargeType,
            chargingPoint: row.chargingPoint,
          },
        });
      })
    );

    // Run getAggregatedActions
    const actions = await getAggregatedActions();
    console.log("[SERVER] Aggregated Actions:", actions);

    return {
      message: `Successfully uploaded ${chargerData.length} charger data entries and ran aggregated actions.`,
      chargerData,
      actions,
    };
  } catch (error) {
    console.error("Error uploading charger data:", error);
    throw new Error(error.message || "Failed to upload charger data");
  }
}
