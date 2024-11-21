"use server";
import prisma from "@/lib/db";
import { getUser } from "@/utils/facades/serverFacades/userFacade";
import { auth } from "@clerk/nextjs/server";

export const deleteVehicleById = async (vehicleId: string) => {
  const userClerk = await auth();
  if (!userClerk) throw new Error("client clerk not found");

  const { userId } = await getUser(userClerk);

  // Fetch the vehicle to ensure it belongs to the authenticated user
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  // Check if the vehicle belongs to the authenticated user
  if (vehicle.ownerID !== userId) {
    throw new Error("You are not authorized to delete this vehicle");
  }

  // Delete the vehicle
  const deletedVehicle = await prisma.vehicle.delete({
    where: {
      id: vehicleId,
    },
  });

  return {
    message: `Vehicle with ID ${vehicleId} deleted successfully`,
    vehicle: deletedVehicle,
  };
};
