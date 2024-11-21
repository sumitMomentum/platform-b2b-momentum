import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Create a new instance of Prisma Client

async function clearBenefits() {
  try {
    console.log("Starting to clear benefits...");

    // Deleting all records in the 'benefit' table
    await prisma.benefit.deleteMany({});
    
    console.log("All benefits records have been deleted.");
  } catch (error) {
    console.error("Error clearing benefits:", error);
  } finally {
    // Disconnect Prisma Client once the operation is complete
    await prisma.$disconnect();
  }
}

clearBenefits();
