"use server";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import csvParser from "csv-parser";

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.DATA_BUCKET;

export const getSignedUploadUrl = async (fileName: string, type: string) => {
  const S3key = `uploads/${fileName}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: S3key,
    ContentType: type,
  });
  return getSignedUrl(s3Client, command);
};

export const getSignedDownloadUrl = async (filename: string) => {
  const S3key = `uploads/${filename}`;
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: S3key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 36000 });
};

export const deleteFile = async (fileName: string) => {
  const S3key = `uploads/${fileName}`;
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: S3key,
  });
  return s3Client.send(command);
};

export const parseAndStoreCSVData = async (filename: string) => {
  const downloadUrl = await getSignedDownloadUrl(filename);
  await parseAndStoreCSVFromURL(downloadUrl);
};

export const parseAndStoreCSVFromURL = async (csvURL: string) => {
  try {
    const response = await fetch(csvURL);

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
    }

    const records = [];
    const text = await response.text();

    const parsedData = await new Promise((resolve, reject) => {
      const parser = csvParser();
      parser.on("data", (record) => {
        records.push(record);
      });
      parser.on("end", () => {
        resolve(records);
      });
      parser.on("error", reject);
      parser.write(text);
      parser.end();
    });

    const result = await storeCSVData(parsedData);
    if (result.success) {
      console.log("CSV data stored successfully");
    } else {
      console.error("Error storing CSV data:", result.error);
    }
  } catch (error) {
    console.error("Error fetching and parsing CSV data:", error);
  }
};

export const storeCSVData = async (csvData) => {
  try {
    //TODO: check what data the csv file has and upload that data to the respective table.
    // await prisma.car.deleteMany({});
    await prisma.car.createMany({
      data: csvData.map((row) => ({
        brand: row.brand,
        model: row.model,
        year: row.year,
        type: row.type,
        integration_status: row.integration_status,
        activation_required: row.activation_required,
        regions: row.regions,
        reliability: row.reliability,
        capabilities: row.capabilities,
        information: row.information,
        charge_state: row.charge_state,
        location: row.location,
        start_stop_commands: row.start_stop_commands,
        smart_charging: row.smart_charging,
        scheduling: row.scheduling,
        statistics: row.statistics,
      })),
      skipDuplicates: true,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
