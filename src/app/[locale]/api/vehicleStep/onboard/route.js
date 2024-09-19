import { NextResponse } from "next/server";
import xlsx from "xlsx";
import VehicleDetails from "@/models/vehicleDetails";
import { connectToDatabase } from "@/lib/mongodb";

// Helper function to parse and trim Excel data
const parseExcelFile = (buffer) => {
  const workbook = xlsx.read(buffer);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  return jsonData.map((row) => {
    const trimmedRow = {};
    for (const key in row) {
      const trimmedKey = key.trim();
      trimmedRow[trimmedKey] = row[key];
    }
    return trimmedRow;
  });
};

export async function POST(req) {
  await connectToDatabase();

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const parsedData = parseExcelFile(Buffer.from(buffer));

  const validationErrors = [];
  for (const vehicleData of parsedData) {
    const newVehicle = new VehicleDetails(vehicleData);
    try {
      await newVehicle.validate();
    } catch (validationError) {
      validationErrors.push({
        row: parsedData.indexOf(vehicleData) + 1,
        errors: validationError.errors,
      });
    }
  }

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { message: "Validation errors found", errors: validationErrors },
      { status: 400 }
    );
  }

  await VehicleDetails.insertMany(parsedData);
  return NextResponse.json({ message: "Vehicles onboarded successfully" });
}
