import fs from 'fs';
import csv from 'csv-parser';

interface ChargingSessionData {
  TripID: number;
  DteStart: number;
  DteEnd: number;
  BatteryAtStart: number;
  BatteryAtEnd: number;
  DwUpdated: Date;
  DiffInBat: number;
  ChargingType: string;
  DiffInDte: number;
}

interface VehicleTripSessionData {
  TripID: number;
  DteStart: number;
  DteEnd: number;
  BatteryAtStart: number;
  BatteryAtEnd: number;
  DwUpdated: Date;
  TripApprovedKilometer: number;
  DiffInBat: number;
  DiffInDte: number;
  vehicleId: string;
}

export async function getChargingSessions(filePath: string): Promise<ChargingSessionData[]> {
  return new Promise((resolve, reject) => {
    const results: ChargingSessionData[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          TripID: parseFloat(data['Trip ID']),
          DteStart: parseInt(data['Dte Start']),
          DteEnd: parseInt(data['Dte End']),
          BatteryAtStart: parseInt(data['Battery At Start']),
          BatteryAtEnd: parseInt(data['Battery At End']),
          DwUpdated: new Date(data['Dw Updated']),
          DiffInBat: parseInt(data['Diff in bat']),
          ChargingType: data['Charging Type'],
          DiffInDte: parseInt(data['Diff in Dte']),
        });
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

export async function getVehicleTripSessions(filePath: string): Promise<VehicleTripSessionData[]> {
  return new Promise((resolve, reject) => {
    const results: VehicleTripSessionData[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          TripID: parseFloat(data['Trip ID']),
          DteStart: parseInt(data['Dte Start']),
          DteEnd: parseInt(data['Dte End']),
          BatteryAtStart: parseInt(data['Battery At Start']),
          BatteryAtEnd: parseInt(data['Battery At End']),
          DwUpdated: new Date(data['Dw Updated']),
          TripApprovedKilometer: parseFloat(data['Trip Approved Kilometer']),
          DiffInBat: parseInt(data['Diff in bat']),
          DiffInDte: parseInt(data['Diff in Dte']),
          vehicleId: data['vehicleId'],
        });
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}
