import { parse } from 'json2csv';
import fs from 'fs';
import { data as vehicleTripSessionsData } from './vehicleTripSessions';
// import { data as chargingSessionsData } from './chargingSessions'; 

// Convert JSON to CSV
const csv = parse(vehicleTripSessionsData);
// const csv = parse(chargingSessionsData);

// Print CSV to console
console.log(csv);

// Save CSV to a file
// fs.writeFileSync('chargingSessions.csv', csv);
fs.writeFileSync('tripSessions.csv', csv);

console.log('CSV file has been saved!');
