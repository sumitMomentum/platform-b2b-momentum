"use server";
import prisma from "@/lib/db";

export const deleteAllVehiclesAndBenefits = async () => {
  try {
    // Step 1: Delete all benefits
    await prisma.benefit.deleteMany();
    console.log("All benefits deleted successfully.");

    // Step 2: Delete all vehicle trip sessions
    await prisma.vehicleTripSession.deleteMany();
    console.log("All vehicle trip sessions deleted successfully.");

    // Step 3: Delete all charging sessions
    await prisma.chargingSession.deleteMany();
    console.log("All charging sessions deleted successfully.");

    // Step 4: Delete all action centres
    await prisma.action.deleteMany();
    console.log("All action centres deleted successfully.");

    // Step 5: Delete all vehicles
    const deletedVehicles = await prisma.vehicle.deleteMany();
    console.log(`All vehicles deleted successfully. Deleted ${deletedVehicles.count} vehicles.`);

    return {
      message: `All vehicles, benefits, vehicle trip sessions, charging sessions, and action centres deleted successfully.`,
    };
  } catch (error) {
    console.error("Error deleting vehicles, benefits, vehicle trip sessions, charging sessions, and action centres:", error);
    throw new Error("An error occurred while deleting vehicles, benefits, vehicle trip sessions, charging sessions, and action centres.");
  }
};
