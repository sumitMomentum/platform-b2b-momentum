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

async function insertActions(actions) {
  console.log("Preparing actions for insertion...");
  const actionInserts = [];

  for (const { vehicleId, description, action } of actions) {
    const existingActions = await prisma.action.findMany({
      where: { vehicleId, description },
    });

    if (!existingActions.length) {
      const actionDetails = actionMapping[action];
      const confirm = Math.random() < 0.5 ? 0 : 1; // Mock confirm logic

      console.log(
        `Preparing action for vehicleId ${vehicleId}, description: ${description}, confirm: ${confirm}`
      );
      actionInserts.push({
        vehicleId,
        severity: actionDetails.severity,
        description: actionDetails.description,
        bestPractice: actionDetails.bestPractice,
        actionToBeTaken: actionDetails.actionToBeTaken,
        createdDateTime: new Date(),
        closedDateTime: new Date(),
        confirm,
      });
    }
  }

  if (actionInserts.length > 0) {
    console.log(`Inserting ${actionInserts.length} actions into the database...`);
    try {
      const result = await prisma.action.createMany({
        data: actionInserts,
        skipDuplicates: true,
      });
      console.log("Successfully inserted actions:", result);
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

  // Aggregate by vehicleId and action description
  const aggregatedActions = allActions.reduce((acc, { vehicleId, actions }) => {
    actions.forEach((action) => {
      const description = actionMapping[action]?.description;
      if (description) {
        const key = `${vehicleId}-${description}`;
        acc[key] = { vehicleId, description, action };
      }
    });
    return acc;
  }, {} as Record<string, { vehicleId: string; description: string; action: string }>);

  return Object.values(aggregatedActions); // Return unique records
}

export async function getAggregatedActions() {
  try {
    console.log("Starting action aggregation process...");
    const uniqueActions = await aggregateActions();

    console.log("Saving unique actions to the database...");
    await insertActions(uniqueActions);

    console.log("Action aggregation and saving completed successfully.");
    return uniqueActions;
  } catch (error) {
    console.error("Error fetching and saving aggregated actions:", error);
    throw new Error("Failed to fetch and save aggregated actions");
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from the database.");
  }
}