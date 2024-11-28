import prisma from "@/lib/db"; // Adjust the import path as needed

// Define the TimeSeriesData type
type TimeSeriesData = {
  timestamp: Date;
  vehicleId: string;
  vin: string;
  dailyKmDriven: number;
  batteryHealthSoH: number;
  energyConsumed: number;
  revenueGenerated: number;
  rangeObserved: number;
};

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

// Fetch all time series data
async function fetchAllTimeSeriesData(): Promise<TimeSeriesData[]> {
  try {
    console.log("Fetching all time series data...");
    const data = await prisma.timeSeriesData.findMany({
      orderBy: { timestamp: "asc" },
    });
    console.log(`Fetched ${data.length} time series records.`);
    return data;
  } catch (error) {
    console.error("Error fetching time series data:", error);
    throw new Error("Failed to fetch time series data.");
  }
}

// Fetch all vehicles
async function fetchAllVehicles(): Promise<{ id: string; vehicleId: string }[]> {
  try {
    console.log("Fetching all vehicles...");
    const vehicles = await prisma.vehicle.findMany({
      select: { id: true, vehicleId: true },
    });
    console.log(`Fetched ${vehicles.length} vehicles.`);
    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw new Error("Failed to fetch vehicles.");
  }
}

// Calculate metrics from time series data
function calculateMetrics(timeSeriesData: TimeSeriesData[]): BenefitMetrics {
  console.log("Calculating metrics...");
  const groupedData = timeSeriesData.reduce((acc, row) => {
    const monthKey = row.timestamp.toISOString().slice(0, 7); // Monthly aggregation key
    if (!acc[monthKey]) {
      acc[monthKey] = { dailyKmDriven: 0, batteryHealthSoH: 0, energyConsumed: 0, revenueGenerated: 0, rangeObserved: 0, count: 0 };
    }
    acc[monthKey].dailyKmDriven += row.dailyKmDriven;
    acc[monthKey].batteryHealthSoH += row.batteryHealthSoH;
    acc[monthKey].energyConsumed += row.energyConsumed;
    acc[monthKey].revenueGenerated += row.revenueGenerated;
    acc[monthKey].rangeObserved += row.rangeObserved;
    acc[monthKey].count += 1;
    return acc;
  }, {} as Record<string, { dailyKmDriven: number; batteryHealthSoH: number; energyConsumed: number; revenueGenerated: number; rangeObserved: number; count: number }>);

  const metrics = Object.values(groupedData).reduce(
    (acc, data) => {
      acc.CurrentSoH += data.batteryHealthSoH / data.count;
      acc.EnergyConsumedMonthly += data.energyConsumed;
      acc.RevenueIncreaseMonthly += data.revenueGenerated;
      acc.RangeIncreaseMonthly += data.rangeObserved / data.count;
      return acc;
    },
    {
      CurrentSoH: 0,
      EnergyConsumedMonthly: 0,
      RevenueIncreaseMonthly: 0,
      RangeIncreaseMonthly: 0,
      InitialSoH: 100.0,
      AgeofCar: 3,
      InitialEnergyPrice: 0.12,
      CurrentEnergyPrice: 0.10,
      ActualDegradation: 0.04,
      vin: timeSeriesData[0]?.vin || "",
      vehicleId: timeSeriesData[0]?.vehicleId || "",
    }
  );

  console.log("Metrics calculated:", metrics);
  return metrics;
}

// Calculate benefits based on metrics
function calculate_benefit(metrics: BenefitMetrics) {
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

  const benefit = {
    vin: metrics.vin,
    vehicleId: metrics.vehicleId,
    batteryCycleSavingMonthly,
    batteryCycleSavingYearly,
    batteryCycleSavingLifetime,
    costSavingChargingMonthly,
    costSavingChargingYearly,
    costSavingChargingLifeTimeEstimate,
    rangeIncreaseMonthly: metrics.RangeIncreaseMonthly,
    rangeIncreaseYearly,
    rangeIncreaseLifetimeEstimate,
    revenueIncreaseLifetime,
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
    const vehicleIds = new Set(vehicles.map((v) => v.vehicleId));
    console.log(`Fetched ${vehicleIds.size} vehicles from the vehicle table.`);

    // Step 3: Fetch all time series data
    const timeSeriesData = await fetchAllTimeSeriesData();
    const metricsByVehicle: { [vehicleId: string]: TimeSeriesData[] } = {};

    // Group time series data by vehicleId
    timeSeriesData.forEach((data) => {
      if (!metricsByVehicle[data.vehicleId]) {
        metricsByVehicle[data.vehicleId] = [];
      }
      metricsByVehicle[data.vehicleId].push(data);
    });

    // Step 4: Process benefits for all vehicles in the vehicle table
    const benefits = await Promise.all(
      Array.from(vehicleIds).map(async (vehicleId) => {
        try {
          const vehicleTimeSeries = metricsByVehicle[vehicleId] || [];
          if (vehicleTimeSeries.length === 0) {
            console.log(`No time series data found for vehicleId ${vehicleId}. Skipping...`);
            return null;
          }
    
          // Calculate metrics and benefits
          const metrics = calculateMetrics(vehicleTimeSeries);
          const benefit = calculate_benefit(metrics);
    
          // Insert benefits into the table
          await prisma.benefit.create({
            data: { ...benefit, vehicleId },
          });
    
          console.log(`Successfully calculated and inserted benefits for vehicleId ${vehicleId}.`);
          return benefit;
        } catch (error) {
          console.error(`Error calculating benefits for vehicleId ${vehicleId}:`, error);
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