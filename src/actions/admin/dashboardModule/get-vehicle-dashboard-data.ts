"use server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const getVehicleDashboardData = async (vehicleId: string) => {
  const userClerk = auth();
  if (!userClerk) throw new Error("client clerk not found");

  const response2 = await fetch(
    `https://demoapi-9d35.onrender.com/api/vehicles?vehicleId=${vehicleId}&step=details`
  );
  const response = await fetch(
    `https://demoapi-9d35.onrender.com/api/vehicles?vehicleId=${vehicleId}&step=2`
  );

  if (!response.ok || !response2.ok) {
    // Check if both responses are successful
    throw new Error(
      `Error fetching data: ${response.status} ${response.statusText}, ${response2.status} ${response2.statusText}`
    );
  }

  const step2Data = await response.json();
  const vehicleDetailsData = await response2.json();

  // Handle potential empty responses
  if (!step2Data || step2Data.length === 0) {
    throw new Error('No data found for this vehicle in Step 2');
  }

  if (!vehicleDetailsData || vehicleDetailsData.length === 0) {
    throw new Error('No vehicle details found');
  }

  const dashboardData = step2Data[0]; // Assuming the API returns an array, take the first element
  const vehicleDetails = vehicleDetailsData[0]; // Assuming the API returns an array, take the first element

  const fakeData = {
    location: "Bangalore, India", // You can customize this based on user location or vehicle data
    datapointsCollected: Math.floor(Math.random() * 10000) + 5000,
    // If totalEnergyConsumed is already in Step2, no need to generate it here
    totalEnergyConsumed: (Math.random() * 500 + 200).toFixed(2), // Random between 200 and 700 kWh (adjust as needed)
    averageChargingRate: (Math.random() * 10 + 5).toFixed(2), // Random between 5 and 15 kW
    temperatureLow: Math.floor(Math.random() * 10) + 20, // Random between 20 and 30 degrees Celsius
    temperatureHigh: Math.floor(Math.random() * 15) + 30, // Random between 30 and 45 degrees Celsius
    socRangeMin: Math.floor(Math.random() * 20) + 10, // Random between 10 and 30%
    socRangeMax: Math.floor(Math.random() * 20) + 80, // Random between 80 and 100%
    rangeObservedMin: Math.floor(Math.random() * 50) + 100, // Random between 100 and 150 km
    rangeObservedMax: Math.floor(Math.random() * 50) + 200, // Random between 200 and 250 km
    // If realRangeObserved is already in Step2, no need to generate it here
    realRangeObserved: Math.floor(Math.random() * 50) + 150, // Random between 150 and 200 km
    epaProvidedRange: Math.floor(Math.random() * 50) + 250, // Random between 250 and 300 km
    // If batteryHealthSoH is already in Step2 as soh, no need to generate it here
    batteryHealthSoH: (Math.random() * 10 + 90).toFixed(2), // Random between 90% and 100%
    estimatedDegradation: (Math.random() * 5 + 2).toFixed(2), // Random between 2% and 7%
    batteryChemistry: "Lithium-ion",
    // endOfLife: getRandomFutureDate(1, 5), // Random date between 1 and 5 years from today
    // remainingUsefulLife: Math.floor(Math.random() * 5) + 3 + " years", // Random between 3 and 7 years
  };

  const completeDashboardData = { ...dashboardData, ...fakeData, ...vehicleDetails};

  console.log(dashboardData);
  console.log(vehicleDetails);

  return completeDashboardData;
};

function getRandomFutureDate(minYears, maxYears) {
  const today = new Date();
  const yearsToAdd = Math.random() * (maxYears - minYears) + minYears;
  const futureDate = new Date(today);
  futureDate.setFullYear(futureDate.getFullYear() + yearsToAdd);
  return futureDate;
}
