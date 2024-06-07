"use server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { getUser } from "@/utils/facades/serverFacades/userFacade";

export const getUserVehicles = async () => {
  const userClerk = auth();

  if (!userClerk) throw new Error("client clerk not found");

  const { userId } = await getUser(userClerk);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      vehicles: true,
    },
  });

  if (!user) throw new Error("User not found");

  return user.vehicles;
};