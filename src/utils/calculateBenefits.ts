import prisma from "@/lib/db"; // Adjust the import path as needed

// Define the BenefitMetrics type
type BenefitMetrics = {
  currentSoH: number;
  energyConsumedMonthly: number;
  revenueIncreaseMonthly: number;
  rangeIncreaseMonthly: number;
  initialSoH: number;
  ageOfCar: number;
  initialEnergyPrice: number;
  currentEnergyPrice: number;
  actualDegradation: number;
  vin: string;
  vehicleId: string;
};

// Fetch all vehicles
async function fetchAllVehicles(): Promise<{ id: number; vehicleId: string; vin: string }[]> {
  try {
    const vehicles = await prisma.vehicle.findMany({
      select: { id: true, vehicleId: true, vin: true },
    });
    return vehicles.map((vehicle) => ({
      ...vehicle,
      id: Number(vehicle.id),
    }));
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw new Error("Failed to fetch vehicles.");
  }
}

// Calculate benefit metrics with realistic values
function calculateMetrics(vehicle: { id: number; vehicleId: string; vin: string }): BenefitMetrics {
  const initialEnergyPrice = vehicle.id % 2 === 0 ? 15 : 25; // USD per kWh (lower for even IDs)
  const currentEnergyPrice = vehicle.id % 2 === 0 ? 25 : 15; // USD per kWh (higher for even IDs)
  const energyConsumedMonthly = 120; // kWh (average for EVs)
  const revenueIncreaseMonthly = 60; // USD (estimated monthly revenue increase)
  const rangeIncreaseMonthly = vehicle.id % 2 === 0 ? -25 : 25; // km (average range improvement per month)
  const currentSoH = 88; // % (current battery state of health)
  const initialSoH = 100; // % (initial battery state of health)
  const ageOfCar = 4; // years
  const actualDegradation = 0.03; // 3% degradation per year

  return {
    currentSoH,
    energyConsumedMonthly,
    revenueIncreaseMonthly,
    rangeIncreaseMonthly,
    initialSoH,
    ageOfCar,
    initialEnergyPrice,
    currentEnergyPrice,
    actualDegradation,
    vin: vehicle.vin,
    vehicleId: vehicle.vehicleId,
  };
}

function calculateBenefit(metrics: BenefitMetrics) {
  const batteryCycleCostPerKWh = 0.4; // USD per kWh cycle
  const batteryCycleSavingMonthly = Math.max(metrics.energyConsumedMonthly * Math.random() * batteryCycleCostPerKWh, 0);
  const batteryCycleSavingYearly = batteryCycleSavingMonthly * 12;
  const batteryCycleSavingLifetime = batteryCycleSavingMonthly * 60; // 5 years

  const costSavingChargingMonthly =
    metrics.energyConsumedMonthly * (metrics.initialEnergyPrice - metrics.currentEnergyPrice) * Math.random();
  const costSavingChargingYearly = Math.max(costSavingChargingMonthly * 12, 0);
  const costSavingChargingLifeTimeEstimate = Math.max(costSavingChargingMonthly * 60, 0); // 5 years

  const rangeIncreaseMonthly = metrics.rangeIncreaseMonthly;
  const rangeIncreaseYearly = rangeIncreaseMonthly * 12;
  const rangeIncreaseLifetimeEstimate = rangeIncreaseMonthly * 60; // 5 years

  const revenueIncreaseLifetime = metrics.revenueIncreaseMonthly * 60; // 5 years

  const estimatedDegradation = metrics.actualDegradation + 0.02; // Adding a 2% buffer for uncertainty
  const difference = Math.max(metrics.currentSoH - estimatedDegradation, 0);
  const loss = Math.max(0, metrics.initialSoH - metrics.currentSoH);

  // Car type determined from a VIN prefix (simplified logic)
  const vinPrefix = metrics.vin.slice(0, 3);
  const carType = vinPrefix.startsWith("SUV")
    ? "SUV"
    : vinPrefix.startsWith("SED")
    ? "Sedan"
    : "Other"; // Simplified logic for determining car type

  return {
    vin: metrics.vin,
    vehicleId: metrics.vehicleId,

    batteryCycleSavingMonthly,
    batteryCycleSavingYearly,
    batteryCycleSavingLifetime,

    costSavingChargingMonthly,
    costSavingChargingYearly,
    costSavingChargingLifeTimeEstimate,

    rangeIncreaseMonthly,
    rangeIncreaseYearly,
    rangeIncreaseLifetimeEstimate,

    revenueIncreaseLifetime,

    initialSoH: metrics.initialSoH,
    ageOfCar: metrics.ageOfCar,
    estimatedDegradation,
    actualDegradation: metrics.actualDegradation,
    difference,
    loss,
    carType,
  };
}


// Update benefits table
async function updateBenefits() {
  try {
    console.log("Starting benefits recalculation...");

    // Clear existing records
    await prisma.benefit.deleteMany();
    console.log("Cleared benefits table.");

    // Fetch vehicles and calculate benefits
    const vehicles = await fetchAllVehicles();
    console.log(`Fetched ${vehicles.length} vehicles.`);

    const benefits = await Promise.all(
      vehicles.map(async (vehicle) => {
        console.log(`Calculating benefits for vehicleId: ${vehicle.vehicleId}...`);
        const metrics = calculateMetrics(vehicle);

        // Log metrics to debug
        console.log("Calculated metrics:", JSON.stringify(metrics, null, 2));

        const benefit = calculateBenefit(metrics);

        // Log the benefit before insertion
        console.log("Calculated benefit:", JSON.stringify(benefit, null, 2));

        try {
          await prisma.benefit.create({ data: benefit });
          console.log(`Inserted benefits for vehicleId: ${metrics.vehicleId}`);
        } catch (insertError) {
          console.error(`Error inserting benefit for vehicleId: ${metrics.vehicleId}:`, insertError);
        }

        return benefit;
      })
    );

    // Calculate average monthly and yearly savings
    const averageMonthlySavings = benefits.reduce((acc, benefit) => acc + benefit.costSavingChargingMonthly, 0) / benefits.length;
    const averageYearlySavings = benefits.reduce((acc, benefit) => acc + benefit.costSavingChargingYearly, 0) / benefits.length;

    console.log("Average Monthly Savings:", averageMonthlySavings);
    console.log("Average Yearly Savings:", averageYearlySavings);

    console.log("Benefits recalculation completed.");
    return benefits;
  } catch (error) {
    console.error("Error during benefits recalculation:", error);
    throw new Error("Failed to recalculate benefits.");
  }
}

export {updateBenefits}