import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

interface ChargingSessionData {
  TripID: number | null;
  DteStart: number;
  DteEnd: number;
  BatteryAtStart: number;
  BatteryAtEnd: number;
  DwUpdated: Date;
  DiffInBat: number;
  ChargingType: string;
  DiffInDte: number;
  vehicleId: string;
  chargerId: number;
}

interface VehicleTripSessionData {
  TripID: number | null;
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

const CHARGER_IDS = [
  315548, 352481, 987512, 357216, 547954, 984752,
  654812, 518652, 974805, 221421, 304571, 621904
];

const VEHICLE_IDS = [
  "KA03AL3782", "KA05AM1248", "KA03AL3783", "KA03AL2098",
  "KA03AL2123", "KA03AL3800", "KA03AL2127", "KA03AL3781",
  "KA03AL3797", "KA03AL2088"
];

function generateTripID() {
  return Math.floor(Math.random() * 1000000); // Customize this as needed
}

function getRandomElementFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function readCSV(filePath: string, transformer: Function, outputFilePath: string) {
  return new Promise<void>((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const vehicleId = getRandomElementFromArray(VEHICLE_IDS);
        results.push(transformer(data, vehicleId));
      })
      .on('end', () => {
        const content = `export const data = ${JSON.stringify(results, null, 2)};\n`;
        fs.writeFileSync(outputFilePath, content);
        resolve();
      })
      .on('error', reject);
  });
}

const chargingSessionTransformer = (data: any, vehicleId: string): ChargingSessionData => ({
  TripID: data['Trip ID'] ? parseFloat(data['Trip ID']) : generateTripID(),
  DteStart: parseInt(data['Dte Start']),
  DteEnd: parseInt(data['Dte End']),
  BatteryAtStart: parseInt(data['Battery At Start']),
  BatteryAtEnd: parseInt(data['Battery At End']),
  DwUpdated: new Date(data['Dw Updated']),
  DiffInBat: parseInt(data['Diff in bat']),
  ChargingType: data['Charging Type'],
  DiffInDte: parseInt(data['Diff in Dte']),
  vehicleId, // Apply the same vehicleId to each entry
  chargerId: getRandomElementFromArray(CHARGER_IDS), // Random chargerId from specified values
});

const vehicleTripSessionTransformer = (data: any, vehicleId: string): VehicleTripSessionData => ({
  TripID: data['Trip ID'] ? parseFloat(data['Trip ID']) : generateTripID(),
  DteStart: parseInt(data['Dte Start']),
  DteEnd: parseInt(data['Dte End']),
  BatteryAtStart: parseInt(data['Battery At Start']),
  BatteryAtEnd: parseInt(data['Battery At End']),
  DwUpdated: new Date(data['Dw Updated']),
  TripApprovedKilometer: parseFloat(data['Trip Approved Kilometer']),
  DiffInBat: parseInt(data['Diff in bat']),
  DiffInDte: parseInt(data['Diff in Dte']),
  vehicleId, // Apply the same vehicleId to each entry
});

async function main() {
  try {
    await readCSV(
      './csvData/df_charge.csv',
      chargingSessionTransformer,
      path.join(__dirname, 'seeds', 'chargingSessions.ts')
    );
    await readCSV(
      './csvData/df_trip.csv',
      vehicleTripSessionTransformer,
      path.join(__dirname, 'seeds', 'vehicleTripSessions.ts')
    );
    console.log('Data extraction completed successfully!');
  } catch (error) {
    console.error('Error during data extraction:', error);
  }
}

main();
