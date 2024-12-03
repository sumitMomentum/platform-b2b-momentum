import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const actionMapping = {
  "Charging Above 90% will lead to battery damage": {
    bestPractice: "Do not charge the vehicle above 90%",
    actionToBeTaken: "Reduce car battery capacity below 90%",
    severity: "High",
    description: "Charging above 90% can lead to battery damage",
  },
  "Battery at end less than 20 percent": {
    bestPractice: "Maintain battery health above 20%",
    actionToBeTaken: "Charge the vehicle",
    severity: "High",
    description: "Battery at end less than 20 percent",
  },
  "Diff in bat less than or equal to 20": {
    bestPractice: "Monitor battery health regularly",
    actionToBeTaken: "Check battery for potential issues",
    severity: "Medium",
    description: "Diff in bat less than or equal to 20",
  },
  "Frequent Charging less than 10% leads to wastage of operation time.": {
    bestPractice: "Avoid frequent short charging sessions",
    actionToBeTaken: "Avoid short charging sessions",
    severity: "Medium",
    description: "Frequent short charging wastes operation time",
  },
};

// Fetch and process charging sessions
async function fetchChargingSessions() {
  console.log("Fetching charging sessions...");
  const chargingSessions = await prisma.chargingSession.findMany();
  console.log(`Fetched ${chargingSessions.length} charging sessions.`);
  return chargingSessions.map((session) => {
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
    console.log(`Actions for vehicle ${session.vehicleId}, TripID ${session.TripID}: ${actions.join(", ")}`);
    return {
      vehicleId: session.vehicleId,
      TripID: session.TripID,
      actions,
    };
  });
}

// Fetch and process vehicle trip sessions
async function fetchVehicleTripSessions() {
  console.log("Fetching vehicle trip sessions...");
  const vehicleTripSessions = await prisma.vehicleTripSession.findMany();
  console.log(`Fetched ${vehicleTripSessions.length} vehicle trip sessions.`);
  return vehicleTripSessions.map((session) => {
    const actions: string[] = [];
    if (session.BatteryAtEnd <= 20) {
      console.log(`Vehicle ${session.vehicleId} has BatteryAtEnd <= 20.`);
      actions.push("Battery at end less than 20 percent");
    }
    if (session.DiffInBat <= 20) {
      console.log(`Vehicle ${session.vehicleId} has DiffInBat <= 20.`);
      actions.push("Diff in bat less than or equal to 20");
    }
    console.log(`Actions for vehicle ${session.vehicleId}, TripID ${session.TripID}: ${actions.join(", ")}`);
    return {
      vehicleId: session.vehicleId,
      TripID: session.TripID,
      actions,
    };
  });
}

// Insert actions into the action table
async function insertActions(
  actionsByVehicle: Array<{
    vehicleId: string;
    TripID: number;
    actions: string[];
  }>
) {
  console.log("Preparing actions for insertion...");
  const actionInserts = [];

  for (const { vehicleId, TripID, actions } of actionsByVehicle) {
    // Check if actions already exist for the vehicle
    const existingActions = await prisma.action.findMany({
      where: { vehicleId },
    });

    if (existingActions.length > 0) {
      console.log(`Skipping actions for vehicleId ${vehicleId} as they already exist.`);
      continue; // Skip the rest of the loop
    }

    actions.forEach((action) => {
      const actionDetails = actionMapping[action];
      if (!actionDetails) {
        console.warn(`No action details found for action: ${action}`);
        return;
      }
      const confirm = TripID % 2 === 0 ? 0 : 1;
      console.log(
        `Preparing action for vehicleId ${vehicleId}, TripID ${TripID}: ${actionDetails.actionToBeTaken}, confirm: ${confirm}`
      );
      actionInserts.push({
        vehicleId,
        severity: actionDetails.severity,
        description: actionDetails.description,
        bestPractice: actionDetails.bestPractice,
        actionToBeTaken: actionDetails.actionToBeTaken,
        createdDateTime: new Date(),
        closedDateTime: new Date(),
        confirm: confirm,
      });
    });
  }

  if (actionInserts.length > 0) {
    console.log(`Inserting ${actionInserts.length} actions into the database...`);
    try {
      const result = await prisma.action.createMany({
        data: actionInserts,
        skipDuplicates: true,
      });
      console.log(`Successfully inserted actions:`, result);
    } catch (error) {
      console.error("Error inserting actions into the database:", error);
    }
  } else {
    console.log("No new actions to insert.");
  }
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
  const aggregatedActions = allActions.reduce(
    (acc, { vehicleId, TripID, actions }) => {
      const key = `${vehicleId}-${TripID}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(...actions);
      console.log(
        `Aggregated actions for vehicleId ${vehicleId} and TripID ${TripID}: ${acc[
          key
        ].join(", ")}`
      );
      return acc;
    },
    {} as Record<string, string[]>
  );

  return Object.entries(aggregatedActions).map(([key, actions]) => {
    const [vehicleId, TripID] = key.split("-");
    return { vehicleId, TripID: Number(TripID), actions };
  });
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
    console.error("Error fetching and saving aggregated actions:", error);
    throw new Error("Failed to fetch and save aggregated actions");
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from the database.");
  }
}
