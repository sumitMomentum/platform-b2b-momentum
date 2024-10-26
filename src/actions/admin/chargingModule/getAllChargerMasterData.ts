"use server";

import { auth } from "@clerk/nextjs";

export const getAllChargerMasterData = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch the chargers data from the API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/charger`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chargers data");
  }


  const data = await response.json()

  return data
};
