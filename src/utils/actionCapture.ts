import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Action Mapping based on Description
const actionMapping = {
  "Charging Above 90% will lead to battery damage": {
    bestPractice: "Do not charge the vehicle above 90%",
    actionToBeTaken: "Reduce car battery capacity below 90%",
    severity: "High",  // Example severity
    description: "Charging above 90% can lead to battery damage"  // Example description
  },
  "Frequent Charging less than 10% leads to wastage of operation time.": {
    bestPractice: "Avoid frequent short charging sessions",
    actionToBeTaken: "Avoid short charging sessions",
    severity: "Medium",  // Example severity
    description: "Frequent short charging wastes operation time"  // Example description
  },
  "Discharging battery below 20% accelerates battery degradation": {
    bestPractice: "Maintain battery health above 20%",
    actionToBeTaken: "Charge the vehicle",
    severity: "High",  // Example severity
    description: "Discharging below 20% accelerates battery degradation"  // Example description
  }
};

// Fetch and process charging sessions
async function fetchChargingSessions() {
  console.log("Fetching charging sessions...");
  const chargingSessions = await prisma.chargingSession.findMany();

  console.log(`Fetched ${chargingSessions.length} charging sessions.`);
  return chargingSessions.map(session => {
    const actions: string[] = [];
    if (session.BatteryAtEnd >= 90) {
      console.log(`Vehicle ${session.vehicleId} has BatteryAtEnd >= 90.`);
      actions.push("Charging Above 90% will lead to battery damage");
    }
    if (session.BatteryAtEnd <= 20) {
      console.log(`Vehicle ${session.vehicleId} has BatteryAtEnd <= 20.`);
      actions.push("Battery at end less than 20 percent");
    }
    if (session.DiffInBat <= 20) {
      console.log(`Vehicle ${session.vehicleId} has DiffInBat <= 20.`);
      actions.push("Diff in bat less than or equal to 20");
    }
    return {
      vehicleId: session.vehicleId,
      actions
    };
  });
}

// Fetch and process vehicle trip sessions
async function fetchVehicleTripSessions() {
  console.log("Fetching vehicle trip sessions...");
  const vehicleTripSessions = await prisma.vehicleTripSession.findMany();

  console.log(`Fetched ${vehicleTripSessions.length} vehicle trip sessions.`);
  return vehicleTripSessions.map(session => {
    const actions: string[] = [];
    if (session.BatteryAtEnd <= 20) {
      console.log(`Vehicle ${session.vehicleId} has BatteryAtEnd <= 20.`);
      actions.push("Battery at end less than 20 percent");
    }
    if (session.DiffInBat <= 20) {
      console.log(`Vehicle ${session.vehicleId} has DiffInBat <= 20.`);
      actions.push("Diff in bat less than or equal to 20");
    }
    return {
      vehicleId: session.vehicleId,
      actions
    };
  });
}

// Insert actions into the action table
async function insertActions(actionsByVehicle: Record<string, string[]>) {
  console.log("Preparing actions for insertion...");
  const actionInserts = [];
  for (const [vehicleId, actions] of Object.entries(actionsByVehicle)) {
    actions.forEach(action => {
      // Check if action exists in actionMapping
      const actionDetails = actionMapping[action];
    
      if (!actionDetails) {
        console.warn(`No action details found for action: ${action}`);
        return;  // Skip to the next action if not found
      }
    
      console.log(`Preparing action for vehicleId ${vehicleId}: ${actionDetails.actionToBeTaken}`);
      actionInserts.push({
        vehicleId,
        severity: actionDetails.severity,  // Insert severity into the database
        description: actionDetails.description,  // Insert description into the database
        bestPractice: actionDetails.bestPractice,
        actionToBeTaken: actionDetails.actionToBeTaken,
        createdDateTime: new Date(),  // Set the current timestamp for creation
        closedDateTime: new Date(),  // Placeholder, could be updated later if necessary
        confirm: 0  // Placeholder, assuming "0" means unconfirmed
      });
    });    
  }

  console.log(`Inserting ${actionInserts.length} actions into the database...`);
  await prisma.action.createMany({
    data: actionInserts,
    skipDuplicates: true, // Avoid inserting duplicates if the table has unique constraints
  });

  console.log(`Successfully inserted ${actionInserts.length} actions.`);
}

// Aggregate actions for each vehicle
async function aggregateActions() {
  console.log("Aggregating actions from charging sessions...");
  const chargingActions = await fetchChargingSessions();

  console.log("Aggregating actions from vehicle trip sessions...");
  const vehicleTripActions = await fetchVehicleTripSessions();

  console.log("Combining all actions...");
  const allActions = [...chargingActions, ...vehicleTripActions];

  console.log(`Total number of action records: ${allActions.length}`);
  const aggregatedActions = allActions.reduce((acc, { vehicleId, actions }) => {
    if (!acc[vehicleId]) {
      acc[vehicleId] = [];
    }
    acc[vehicleId].push(...actions);
    console.log(`Aggregated actions for vehicleId ${vehicleId}: ${acc[vehicleId].join(", ")}`);
    return acc;
  }, {} as Record<string, string[]>);

  return aggregatedActions;
}

// Server function to fetch and aggregate actions for all vehicles and save them in the database
export async function getAggregatedActions() {
  try {
    console.log("Starting action aggregation process...");
    const aggregatedActions = await aggregateActions();

    console.log("Saving aggregated actions to the database...");
    await insertActions(aggregatedActions);

    console.log("Action aggregation and saving completed successfully.");
    return aggregatedActions;
  } catch (error) {
    console.error('Error fetching and saving aggregated actions:', error);
    throw new Error('Failed to fetch and save aggregated actions');
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from the database.");
  }
}
