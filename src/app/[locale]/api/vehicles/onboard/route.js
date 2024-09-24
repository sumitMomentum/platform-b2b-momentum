import { NextResponse } from "next/server";
import xlsx from "xlsx";
import formidable from "formidable";
import { connectToDatabase } from "@/lib/mongodb";

var VehicleDetails = require('@/models/vehicleDetails.js');
// // Disable body parser for file uploads
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

async function parseExcel(file) {
  const workbook = xlsx.read(file);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

export async function POST(req) {
  await connectToDatabase();

  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("File upload error:", err);
        return resolve(
          NextResponse.json({ error: "File upload error" }, { status: 400 })
        );
      }

      try {
        const jsonData = await parseExcel(files.file.filepath);

        // Validate data using VehicleDetails model
        const validationErrors = [];
        for (const vehicleData of jsonData) {
          const newVehicle = new VehicleDetails(vehicleData);
          try {
            await newVehicle.validate();
          } catch (validationError) {
            validationErrors.push({
              row: jsonData.indexOf(vehicleData) + 1, // Excel row number
              errors: validationError.errors,
            });
          }
        }

        if (validationErrors.length > 0) {
          return resolve(
            NextResponse.json(
              {
                message: "Validation errors found in the uploaded data",
                errors: validationErrors,
              },
              { status: 400 }
            )
          );
        }

        // Save validated data to MongoDB
        const vehicles = await VehicleDetails.insertMany(jsonData);

        resolve(
          NextResponse.json(
            {
              message: "Vehicles onboarded successfully",
              vehicles,
            },
            { status: 200 }
          )
        );
      } catch (error) {
        console.error("Error onboarding vehicles:", error);
        resolve(
          NextResponse.json({ error: "Internal server error" }, { status: 500 })
        );
      }
    });
  });
}
