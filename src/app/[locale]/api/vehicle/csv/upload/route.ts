import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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

    // Process and insert vehicles
    const vehicles = await Promise.all(
      results.map(async (row) => {
        return await prisma.vehicle.create({
          data: {
            id: row.id,
            vin: row.vin,
            vehicleId: row.vehicleId,
            model: row.model,
            year: parseInt(row.year),
            batteryCapacity: parseInt(row.batteryCapacity),
            soc: parseInt(row.soc),
            dateOfConnection: new Date(),
            make: row.make,
            owner: {
              connect: { id: parseInt(row.ownerId) }
            }
            // Add other fields as needed
          }
        });
      })
    );

    return NextResponse.json({ 
      message: `Successfully uploaded ${vehicles.length} vehicles`,
      vehicles 
    });

  } catch (error: any) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
