"use server";
import prisma from "@/lib/db";
import csv from "csv-parser";
import { Readable } from "stream";

export async function uploadTripsFromCSV(formData: FormData) {
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

    // Process and insert trip sessions
    const tripSessions = await Promise.all(
      results.map(async (row) => {
        return await prisma.vehicleTripSession.create({
          data: {
            TripID: row.TripID ? parseFloat(row.TripID) : undefined,
            DteStart: row.DteStart ? parseInt(row.DteStart) : undefined,
            DteEnd: row.DteEnd ? parseInt(row.DteEnd) : undefined,
            BatteryAtStart: row.BatteryAtStart
              ? parseInt(row.BatteryAtStart)
              : undefined,
            BatteryAtEnd: row.BatteryAtEnd
              ? parseInt(row.BatteryAtEnd)
              : undefined,
            DwUpdated: row.DwUpdated ? parseDate(row.DwUpdated) : undefined,
            TripApprovedKilometer: row.TripApprovedKilometer
              ? parseFloat(row.TripApprovedKilometer)
              : undefined,
            DiffInBat: row.DiffInBat ? parseInt(row.DiffInBat) : undefined,
            DiffInDte: row.DiffInDte ? parseInt(row.DiffInDte) : undefined,
            createdAt: row.createdAt ? parseDate(row.createdAt) : undefined,
            updatedAt: row.updatedAt ? parseDate(row.updatedAt) : undefined,
            vehicleId: row.vehicleId ? row.vehicleId : null,
          },
        });
      })
    );

    return {
      message: `Successfully uploaded ${tripSessions.length} trip sessions`,
      tripSessions,
    };
  } catch (error) {
    console.error("Error uploading trip sessions:", error);
    throw new Error(error.message || "Failed to upload trip sessions");
  }
}
