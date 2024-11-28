import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Create a new instance of Prisma Client

async function clearDatabase() {
  try {
    console.log("Starting to clear benefits, vehicles, sessions, and actions...");

    // Deleting all records in the 'action' table
    await prisma.action.deleteMany({});
    console.log("All action records have been deleted.");

    // Deleting all records in the 'chargingSession' table
    await prisma.chargingSession.deleteMany({});
    console.log("All charging session records have been deleted.");

    // Deleting all records in the 'vehicleTripSession' table
    await prisma.vehicleTripSession.deleteMany({});
    console.log("All vehicle trip session records have been deleted.");

    // Deleting all records in the 'benefit' table
    await prisma.benefit.deleteMany({});
    console.log("All benefit records have been deleted.");

    // Deleting all records in the 'vehicle' table
    await prisma.vehicle.deleteMany({});
    console.log("All vehicle records have been deleted.");

  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    // Disconnect Prisma Client once the operation is complete
    await prisma.$disconnect();
  }
}

// Run the clearDatabase function
clearDatabase();
