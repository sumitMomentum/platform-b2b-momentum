import { NextResponse } from "next/server";
import xlsx from "xlsx";
import formidable from "formidable";
import VehicleDetails from "@/models/vehicleDetails";
import { connectToDatabase } from "@/lib/mongodb";

// Disable body parser for file uploads
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

        const validationErrors = [];

        for (const vehicleData of jsonData) {
          const vehicleId = vehicleData["vehicleId"];
          delete vehicleData["vehicleId"];

          // Validate that the vehicle ID exists
          const existingVehicle = await VehicleDetails.findOne({ vehicleId });
          if (!existingVehicle) {
            validationErrors.push({
              row: jsonData.indexOf(vehicleData) + 1,
              errors: { vehicleId: "Vehicle not found" },
            });
            continue;
          }

          const updateData = {};
          for (const key in vehicleData) {
            if (vehicleData[key] !== undefined && vehicleData[key] !== null) {
              updateData[key] = vehicleData[key];
            }
          }

          const tempVehicle = new VehicleDetails({
            ...existingVehicle.toObject(),
            ...updateData,
          });

          try {
            await tempVehicle.validate();
          } catch (validationError) {
            validationErrors.push({
              row: jsonData.indexOf(vehicleData) + 1,
              errors: validationError.errors,
            });
            continue;
          }

          // Perform the update
          await VehicleDetails.updateOne({ vehicleId }, { $set: vehicleData });
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

        resolve(
          NextResponse.json(
            { message: "Vehicles updated successfully" },
            { status: 200 }
          )
        );
      } catch (error) {
        console.error("Error updating vehicles:", error);
        resolve(
          NextResponse.json({ error: "Internal server error" }, { status: 500 })
        );
      }
    });
  });
}
