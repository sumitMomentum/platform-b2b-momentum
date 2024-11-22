import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

interface VehicleAction {
  vehicleId: string;
  severity: string;
  description: string;
  bestPractice: string;
  actionToBeTaken: string;
  confirm: number;
  createdDateTime: Date;
  closedDateTime: Date;
}

function readCSVAndTransform(filePath: string, outputFilePath: string) {
  return new Promise<void>((resolve, reject) => {
    const results: VehicleAction[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          vehicleId: data['Vehicle No'],
          severity: data['Severity'],
          description: data['Description'],
          bestPractice: data['Best Practice'],
          actionToBeTaken: data['Action to be taken'],
          confirm: parseInt(data['Confirm']),
          createdDateTime: new Date(data['Created Date Time']),
          closedDateTime: new Date(data['Closed Date Time'])
        });
      })
      .on('end', () => {
        const content = `export const vehicleActions = ${JSON.stringify(results, null, 2)};\n`;
        fs.writeFileSync(outputFilePath, content);
        resolve();
      })
      .on('error', reject);
  });
}

async function main() {
  try {
    await readCSVAndTransform(
      './csvData/df_action.csv',  // Replace with your actual CSV file path
      path.join(__dirname, 'vehicleActions.ts')
    );
    console.log('Data transformation completed successfully!');
  } catch (error) {
    console.error('Error during data transformation:', error);
  }
}

main();
