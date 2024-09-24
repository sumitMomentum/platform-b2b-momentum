import { NextResponse } from 'next/server';
import xlsx from 'xlsx';
import { connectToDatabase } from "@/lib/mongodb";

var VehicleDetails = require('@/models/vehicleDetails.js');
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
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const parsedData = parseExcelFile(Buffer.from(buffer));

  const validationErrors = [];
  for (const vehicleData of parsedData) {
    const vehicleId = vehicleData.vehicleId;
    delete vehicleData.vehicleId;

    const existingVehicle = await VehicleDetails.findOne({ vehicleId });
    if (!existingVehicle) {
      validationErrors.push({ row: parsedData.indexOf(vehicleData) + 1, errors: { vehicleId: 'Vehicle not found' } });
      continue;
    }

    const updateData = {};
    for (const key in vehicleData) {
      if (vehicleData[key]) updateData[key] = vehicleData[key];
    }

    const tempVehicle = new VehicleDetails({ ...existingVehicle.toObject(), ...updateData });
    try {
      await tempVehicle.validate();
    } catch (validationError) {
      validationErrors.push({ row: parsedData.indexOf(vehicleData) + 1, errors: validationError.errors });
      continue;
    }

    await VehicleDetails.updateOne({ vehicleId }, { $set: vehicleData });
  }

  if (validationErrors.length > 0) {
    return NextResponse.json({ message: 'Validation errors found', errors: validationErrors }, { status: 400 });
  }

  return NextResponse.json({ message: 'Vehicles updated successfully' });
}
