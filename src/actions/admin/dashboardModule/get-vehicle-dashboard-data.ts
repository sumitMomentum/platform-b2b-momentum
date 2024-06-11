"use server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const getVehicleDashboardData = async (vehicleId: string) => {
  const userClerk = auth();
  if (!userClerk) throw new Error("client clerk not found");

  const dashboardData = await prisma.vehicleDashboardData.findFirst({
    where:{
        vehicleId: vehicleId
    },
  });

  if (!dashboardData) throw new Error("User not found");

  return dashboardData;
};