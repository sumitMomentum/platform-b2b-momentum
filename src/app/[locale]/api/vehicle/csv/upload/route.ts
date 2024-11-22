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
            ownerID: row.ownerID,
            soc: parseInt(row.soc),
            dateOfConnection: new Date(row.dateOfConnection),
            odometerFloat: parseFloat(row.odometerFloat),
            UsageAverageDailyKmDriven: parseFloat(row.UsageAverageDailyKmDriven),
            MonthlyUsage: parseFloat(row.MonthlyUsage),
            condition: row.condition,
            status: row.status,
            make: row.make,
            batteryHealthSoH: parseFloat(row.batteryHealthSoH),
            batteryHealthDegradation: parseFloat(row.batteryHealthDegradation),
            location: row.location,
            soh: parseFloat(row.soh),
            BatteryHealthAverageEstimatedDegradation: parseFloat(row.BatteryHealthAverageEstimatedDegradation),
            BatteryHealthAverageSoC: parseFloat(row.BatteryHealthAverageSoC),
            BatteryHealthTotalBatteries: parseInt(row.BatteryHealthTotalBatteries),
            ConnectorType: row.ConnectorType,
            EndofLife: row.EndofLife,
            RealRangeObserved: parseFloat(row.RealRangeObserved),
            RemainingUsefulLife: parseFloat(row.RemainingUsefulLife),
            TotalChargingSession: parseInt(row.TotalChargingSession),
            TotalEnergyConsumed: parseFloat(row.TotalEnergyConsumed),
            VehicleConditionCritical: parseInt(row.VehicleConditionCritical),
            VehicleConditionGood: parseInt(row.VehicleConditionGood),
            VehicleConditionSatisfactory: parseInt(row.VehicleConditionSatisfactory),
            VehicleStatusActive: row.VehicleStatusActive,
            VehicleStatusCharging: row.VehicleStatusCharging,
            VehicleStatusInUse: row.VehicleStatusInUse,
            VehicleStatusOutofService: row.VehicleStatusOutofService,
            EPAWLTPProvidedRange: parseFloat(row.EPAWLTPProvidedRange),
            UsageRangeObservedMax: parseFloat(row.UsageRangeObservedMax),
            UsageRangeObservedMin: parseFloat(row.UsageRangeObservedMin),
            UsageSoCRangeMax: parseFloat(row.UsageSoCRangeMax),
            UsageSoCRangeMin: parseFloat(row.UsageSoCRangeMin),
            UsageTemperatureHigh: parseFloat(row.UsageTemperatureHigh),
            UsageTemperatureLow: parseFloat(row.UsageTemperatureLow),
            batteryChemistry: row.batteryChemistry,
            BatteryHealthAverageSoH: parseFloat(row.BatteryHealthAverageSoH),
            DataPointsCollected: parseInt(row.DataPointsCollected),
            averageMonthlyUsage: parseFloat(row.averageMonthlyUsage),
            ownerId: row.ownerId,
          },
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
