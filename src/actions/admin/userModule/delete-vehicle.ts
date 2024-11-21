"use server";
import prisma from "@/lib/db";

export const deleteVehicleById = async (vehicleId: string) => {

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }
  // Delete the vehicle
  const deletedVehicle = await prisma.vehicle.delete({
    where: {
      id: vehicleId,  // Ensure this is uniquely indexed
    },
  });

  return {
    message: `Vehicle with ID ${vehicleId} deleted successfully`,
    vehicle: deletedVehicle,
  };
};
