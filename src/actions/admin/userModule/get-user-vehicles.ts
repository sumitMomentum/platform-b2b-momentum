"use server";

import { auth } from "@clerk/nextjs/server";

export const getUserVehicles = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch the vehicles data from the API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicle`
  ); // Use the correct base URL

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles data");
  }

  return await response.json();
};

// import prisma from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { getUser } from "@/utils/facades/serverFacades/userFacade";

// export const getUserVehicles = async () => {
//   const userClerk = await auth();

//   if (!userClerk) throw new Error("client clerk not found");

//   const { userId } = await getUser(userClerk);

//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//     include: {
//       vehicles: true,
//     },
//   });

//   if (!user) throw new Error("User not found");

//   return user.vehicles;
// };
