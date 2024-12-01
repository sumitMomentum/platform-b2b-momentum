import prisma from "@/lib/db"; // Adjust the import path as needed

// Define the BenefitMetrics type
type BenefitMetrics = {
  CurrentSoH: number;
  EnergyConsumedMonthly: number;
  RevenueIncreaseMonthly: number;
  RangeIncreaseMonthly: number;
  InitialSoH: number;
  AgeofCar: number;
  InitialEnergyPrice: number;
  CurrentEnergyPrice: number;
  ActualDegradation: number;
  vin: string;
  vehicleId: string;
  [key: string]: any;
};

// Fetch all vehicles
async function fetchAllVehicles(): Promise<{ id: number; vehicleId: string; vin: string }[]> {
  try {
    console.log("Fetching all vehicles...");
    const vehicles = await prisma.vehicle.findMany({
      select: { id: true, vehicleId: true, vin: true },
    });
    console.log(`Fetched ${vehicles.length} vehicles.`);
    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw new Error("Failed to fetch vehicles.");
  }
}

// Calculate benefit metrics with placeholder values
function calculateMetrics(vehicle: { id: number; vehicleId: string; vin: string }): BenefitMetrics {
  console.log(`Calculating metrics for vehicle ${vehicle.vehicleId}...`);
  const metrics: BenefitMetrics = {
    CurrentSoH: 90,  // Placeholder
    EnergyConsumedMonthly: 100,  // Placeholder
    RevenueIncreaseMonthly: 50,  // Placeholder
    RangeIncreaseMonthly: 30,  // Placeholder
    InitialSoH: 100,
    AgeofCar: 3,
    InitialEnergyPrice: 0.12,
    CurrentEnergyPrice: 0.10,
    ActualDegradation: 0.04,
    vin: vehicle.vin,
    vehicleId: vehicle.vehicleId,
  };
  console.log("Metrics calculated:", metrics);
  return metrics;
}

// Calculate benefits based on metrics
function calculate_benefit(vehicle: { id: number; vehicleId: string; vin: string }, metrics: BenefitMetrics) {
  console.log(`Calculating benefits for vehicle ${metrics.vehicleId} (VIN: ${metrics.vin})...`);
  const batteryCycleSavingMonthly = metrics.EnergyConsumedMonthly * 0.01; // Example calculation
  const batteryCycleSavingYearly = batteryCycleSavingMonthly * 12;
  const batteryCycleSavingLifetime = batteryCycleSavingMonthly * 60; // Assuming 5 years lifetime
  const costSavingChargingMonthly = metrics.EnergyConsumedMonthly * (metrics.InitialEnergyPrice - metrics.CurrentEnergyPrice);
  const costSavingChargingYearly = costSavingChargingMonthly * 12;
  const costSavingChargingLifeTimeEstimate = costSavingChargingMonthly * 60; // Assuming 5 years lifetime
  const rangeIncreaseYearly = metrics.RangeIncreaseMonthly * 12;
  const rangeIncreaseLifetimeEstimate = metrics.RangeIncreaseMonthly * 60; // Assuming 5 years lifetime
  const revenueIncreaseLifetime = metrics.RevenueIncreaseMonthly * 60; // Assuming 5 years lifetime
  const difference = metrics.CurrentSoH - metrics.ActualDegradation;
  const loss = Math.max(0, metrics.InitialSoH - metrics.CurrentSoH); // Example calculation for loss
  const carType = "Sedan"; // Placeholder; dynamically calculate if needed

  const factor = vehicle.id % 2 === 0 ? -1 : 1;

  const benefit = {
    vin: metrics.vin,
    vehicleId: metrics.vehicleId,
    batteryCycleSavingMonthly: batteryCycleSavingMonthly * factor,
    batteryCycleSavingYearly: batteryCycleSavingYearly * factor,
    batteryCycleSavingLifetime: batteryCycleSavingLifetime * factor,
    costSavingChargingMonthly: costSavingChargingMonthly * factor,
    costSavingChargingYearly: costSavingChargingYearly * factor,
    costSavingChargingLifeTimeEstimate: costSavingChargingLifeTimeEstimate * factor,
    rangeIncreaseMonthly: metrics.RangeIncreaseMonthly * factor,
    rangeIncreaseYearly: rangeIncreaseYearly * factor,
    rangeIncreaseLifetimeEstimate: rangeIncreaseLifetimeEstimate * factor,
    revenueIncreaseLifetime: revenueIncreaseLifetime * factor,
    initialSoH: metrics.InitialSoH,
    ageOfCar: metrics.AgeofCar,
    estimatedDegradation: 0, // Placeholder
    actualDegradation: metrics.ActualDegradation,
    difference,
    loss,
    carType,
  };

  console.log("Benefits calculated:", benefit);
  return benefit;
}

// Update benefits table
async function updateBenefits() {
  console.log("Starting full benefits recalculation...");
  try {
    // Step 1: Clear the benefits table
    await prisma.benefit.deleteMany();
    console.log("Cleared all records from the benefits table.");

    // Step 2: Fetch all vehicles
    const vehicles = await fetchAllVehicles();
    console.log(`Fetched ${vehicles.length} vehicles from the vehicle table.`);

    // Step 3: Process benefits for all vehicles
    const benefits = await Promise.all(
      vehicles.map(async (vehicle) => {
        try {
          // Calculate metrics and benefits
          const metrics = calculateMetrics(vehicle);
          const benefit = calculate_benefit(vehicle, metrics);
    
          // Insert benefits into the table
          await prisma.benefit.create({
            data: benefit,
          });
    
          console.log(`Successfully calculated and inserted benefits for vehicleId ${vehicle.vehicleId}.`);
          return benefit;
        } catch (error) {
          console.error(`Error calculating benefits for vehicleId ${vehicle.vehicleId}:`, error);
          return null;
        }
      })
    );
    

    console.log("Full benefits recalculation completed.");
    return benefits.filter((b) => b !== null); // Return only successful benefit calculations
  } catch (error) {
    console.error("Error during benefits recalculation:", error);
    throw new Error("Failed to recalculate benefits.");
  }
}

export { updateBenefits };
