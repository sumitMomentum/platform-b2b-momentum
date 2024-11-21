import prisma from "@/lib/db";  // Adjust the import path as needed

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

async function fetchAllTimeSeriesData(): Promise<TimeSeriesData[]> {
  console.log("Fetching all time series data...");
  const data = await prisma.timeSeriesData.findMany({
    orderBy: { timestamp: 'asc' },
  });
  console.log(`Fetched ${data.length} time series records.`);
  return data;
}

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
  }, {} as Record<string, { dailyKmDriven: number, batteryHealthSoH: number, energyConsumed: number, revenueGenerated: number, rangeObserved: number, count: number }>);

  const metrics = Object.values(groupedData).reduce((acc, data) => {
    acc.CurrentSoH += data.batteryHealthSoH / data.count;
    acc.EnergyConsumedMonthly += data.energyConsumed;
    acc.RevenueIncreaseMonthly += data.revenueGenerated;
    acc.RangeIncreaseMonthly += data.rangeObserved / data.count;
    return acc;
  }, {
    CurrentSoH: 0,
    EnergyConsumedMonthly: 0,
    RevenueIncreaseMonthly: 0,
    RangeIncreaseMonthly: 0,
    InitialSoH: 100.0,
    AgeofCar: 3,
    InitialEnergyPrice: 0.12,
    CurrentEnergyPrice: 0.10,
    ActualDegradation: 0.04,
    vin: timeSeriesData.length ? timeSeriesData[0].vin : '',
    vehicleId: timeSeriesData.length ? timeSeriesData[0].vehicleId : '',
  });

  console.log("Metrics calculated:", metrics);
  return metrics;
}

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
  const carType = 'Sedan'; // Assuming a static car type for now; this should be dynamically determined if possible

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
    estimatedDegradation: 0, // Example value; replace with actual calculation if available
    actualDegradation: metrics.ActualDegradation,
    difference,
    loss,
    carType,
  };

  console.log("Benefits calculated:", benefit);
  return benefit;
}

async function updateBenefits() {
  console.log("Starting benefit updates...");
  const timeSeriesData = await fetchAllTimeSeriesData();
  const metricsByVehicle: { [vehicleId: string]: TimeSeriesData[] } = {};

  // Group metrics by vehicleId
  timeSeriesData.forEach((data) => {
    if (!metricsByVehicle[data.vehicleId]) {
      metricsByVehicle[data.vehicleId] = [];
    }
    metricsByVehicle[data.vehicleId].push(data);
  });

  console.log(`Processing benefits for ${Object.keys(metricsByVehicle).length} vehicles...`);

  const benefits = await Promise.all(
    Object.keys(metricsByVehicle).map(async (vehicleId) => {
      try {
        const metrics = calculateMetrics(metricsByVehicle[vehicleId]);
        const benefits = calculate_benefit(metrics);

        // Update the benefits in the database
        await prisma.benefit.create({
            data: { ...benefits, vehicleId },
        });          

        console.log(`Successfully updated benefits for vehicleId ${vehicleId}.`);
        return benefits;
      } catch (error) {
        console.error(`Error updating benefits for vehicleId ${vehicleId}:`, error);
        throw error; // Continue the loop even if one vehicle fails
      }
    })
  );

  console.log("Benefit updates completed.");
  return benefits;
}

export { updateBenefits };
