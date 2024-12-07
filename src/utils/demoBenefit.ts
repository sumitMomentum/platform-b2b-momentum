import prisma from "@/lib/db"; // Adjust the import path as needed
import fetchOpenVehicleActions from "@/actions/admin/benefitsListModule/fetchOpenVehicleActions";
import fetchVehicleData from "@/actions/admin/csvModule/vehicle/getAllVehicleId";

// Define the BenefitMetrics type
type BenefitMetrics = {
  initialSoH: number;
  currentSoH: number;
  energyConsumedMonthly: number;
  revenueIncreaseMonthly: number;
  rangeIncreaseMonthly: number;
  ageOfCar: number;
  energyPrice: number;
  actualDegradation: number;
  cyclesSaved: number;
  vin: string;
  vehicleId: string;
};

async function calculateBatteryCyclesAndDegradation(chargingSessions: any[]): Promise<{ [vehicleId: string]: { actualDegradation: number; cyclesSaved: number } }> {
    console.log("Using provided charging sessions...");
    console.log("Charging sessions received:", JSON.stringify(chargingSessions, null, 2));
  
    console.log("Fetching all action center data...");
    const actions = await fetchOpenVehicleActions();
    console.log("Action center data fetched:", JSON.stringify(actions, null, 2));
  
    if (!Array.isArray(chargingSessions)) {
        throw new Error("Expected chargingSessions to be an array");
    }
  
    console.log("Grouping sessions by vehicleId...");
    const sessionsGroupedByVehicle = chargingSessions.reduce((acc, session) => {
        (acc[session.vehicleId] = acc[session.vehicleId] || []).push(session);
        return acc;
    }, {});
    console.log("Grouped sessions by vehicleId:", JSON.stringify(sessionsGroupedByVehicle, null, 2));
  
    console.log("Grouping actions by vehicleId...");
    const actionsGroupedByVehicle = actions.reduce((acc, action) => {
        if (action.vehicleId) {
            acc[action.vehicleId] = acc[action.vehicleId] || [];
            acc[action.vehicleId].push(action);
        }
        return acc;
    }, {});
    console.log("Grouped actions by vehicleId:", JSON.stringify(actionsGroupedByVehicle, null, 2));
  
    const results: { [vehicleId: string]: { actualDegradation: number; cyclesSaved: number } } = {};
    
    for (const vehicleId in sessionsGroupedByVehicle) {
        const vehicleSessions = sessionsGroupedByVehicle[vehicleId];
        const vehicleActions = actionsGroupedByVehicle[vehicleId] || [];
        
        const totalSessions = vehicleSessions.length;
        const actionCentreActionsCount = vehicleActions.length;

        console.log(`Vehicle ID: ${vehicleId} - Total Sessions: ${totalSessions}, Action Centre Actions Count: ${actionCentreActionsCount}`);
        
        // Use actual degradation from the action data
        const actualDegradation = vehicleActions.reduce((sum, action) => sum + action.actualDegradation, 0);
        
        // Calculate cycles saved based on your logic
        const cyclesSaved = totalSessions - (actionCentreActionsCount * 0.25);

        results[vehicleId] = { actualDegradation, cyclesSaved };
    }
  
    console.log("Final battery cycles and degradation results:", JSON.stringify(results, null, 2));
    return results;
}
  

// Calculate benefit metrics with realistic values
async function calculateMetrics(vehicle: { id: number; vehicleId: string; vin: string }, batteryCyclesAndDegradation: { [vehicleId: string]: { actualDegradation: number; cyclesSaved: number } }): Promise<BenefitMetrics> {
//   const energyPrice = vehicle.id % 2 === 0 ? -40.39 : 40.39; // USD per kWh (example value, can be adjusted)
  const energyPrice = vehicle.id % 2 === 0 ? -25 : 25; // USD per kWh (example value, can be adjusted)
  const energyConsumedMonthly = 120; // kWh (average for EVs)
  const revenueIncreaseMonthly = 60; // USD (estimated monthly revenue increase)
  const rangeIncreaseMonthly = vehicle.id % 2 === 0 ? -25 : 25; // km (average range improvement per month)
  const initialSoH = 100; // % (initial state of health)
  const currentSoH = 88; // % (current state of health)
  const ageOfCar = 4; // years

  const { actualDegradation, cyclesSaved } = batteryCyclesAndDegradation[vehicle.vehicleId] || { actualDegradation: 0, cyclesSaved: 0 };

  console.log(`Metrics calculated for vehicle ${vehicle.vehicleId}:`, {
    initialSoH,
    currentSoH,
    energyConsumedMonthly,
    revenueIncreaseMonthly,
    rangeIncreaseMonthly,
    ageOfCar,
    energyPrice,
    actualDegradation,
    cyclesSaved,
    vin: vehicle.vin,
    vehicleId: vehicle.vehicleId,
  });

  return {
    initialSoH,
    currentSoH,
    energyConsumedMonthly,
    revenueIncreaseMonthly,
    rangeIncreaseMonthly,
    ageOfCar,
    energyPrice,
    actualDegradation,
    cyclesSaved,
    vin: vehicle.vin,
    vehicleId: vehicle.vehicleId,
  };
}

async function calculateBenefit(metrics: BenefitMetrics) {
  console.log("Calculating benefits with metrics:", JSON.stringify(metrics, null, 2));

  const batteryCycleSavingMonthly = metrics.cyclesSaved;
  const batteryCycleSavingYearly = batteryCycleSavingMonthly * 12;
  const batteryCycleSavingLifetime = batteryCycleSavingMonthly * 60; // 5 years

  const costSavingChargingMonthly = metrics.energyConsumedMonthly * metrics.energyPrice * Math.random();
  const costSavingChargingYearly = Math.max(costSavingChargingMonthly * 12, 0);
  const costSavingChargingLifeTimeEstimate = Math.max(costSavingChargingMonthly * 60, 0); // 5 years

  const rangeIncreaseMonthly = metrics.rangeIncreaseMonthly;
  const rangeIncreaseYearly = rangeIncreaseMonthly * 12;
  const rangeIncreaseLifetimeEstimate = rangeIncreaseMonthly * 60; // 5 years

  const revenueIncreaseLifetime = metrics.revenueIncreaseMonthly * 60; // 5 years

  const estimatedDegradation = metrics.actualDegradation + 0.02; // Adding a 2% buffer for uncertainty
  const difference = Math.max(metrics.currentSoH - estimatedDegradation, 0);
  const loss = Math.max(0, metrics.initialSoH - metrics.currentSoH);

  const benefit = {
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
    // currentSoH: metrics.currentSoH,
    ageOfCar: metrics.ageOfCar,
    estimatedDegradation,
    actualDegradation: metrics.actualDegradation,
    difference,
    loss,
    carType: "SUV", // Static value for simplicity
  };

  console.log("Benefit calculated:", JSON.stringify(benefit, null, 2));
  return benefit;
}

// Update benefits table
async function updateBenefits(chargingSessions: any[]) {
  try {
    console.log("Starting benefits recalculation...");

    const [vehicles, batteryCyclesAndDegradation] = await Promise.all([fetchVehicleData(), calculateBatteryCyclesAndDegradation(chargingSessions)]);

    console.log("Fetched vehicles and calculated battery cycles and degradation.");
    console.log("Vehicles:", JSON.stringify(vehicles, null, 2));
    console.log("Battery cycles and degradation:", JSON.stringify(batteryCyclesAndDegradation, null, 2));

    const benefits = await Promise.all(
      vehicles.map(async (vehicle) => {
        const metrics = await calculateMetrics(vehicle, batteryCyclesAndDegradation);

        console.log("Calculated metrics:", JSON.stringify(metrics, null, 2));

        const benefit = await calculateBenefit(metrics);

        console.log("Calculated benefit:", JSON.stringify(benefit, null, 2));

        return benefit;
      })
    );

    // Batch insert benefits into the database
    await prisma.benefit.createMany({ data: benefits });

    console.log("Benefits recalculation completed.");
    return benefits;
  } catch (error) {
    console.error("Error during benefits recalculation:", error);
    throw new Error("Failed to recalculate benefits.");
  }
}

export { updateBenefits };
