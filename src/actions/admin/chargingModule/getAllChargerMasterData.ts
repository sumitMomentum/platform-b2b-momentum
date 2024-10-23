"use server";

import { auth } from "@clerk/nextjs";
import { ok } from "assert";
import { json } from "stream/consumers";

export const getAllChargerMasterData = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch the chargers data from the API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/chargers`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chargers data");
  }

  console.log(response.json());
  
  return await response.json();
};

// export const getAllChargerMasterData = async () => {
//   try {
//     const response = await fetch(
//       `https://demoapi-9d35.onrender.com/api/vehicles/charging/allChargerMaster`
//       // `${process.env.BACKEND_URL}/api/vehicles/charging/allChargerMaster`
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Error fetching charger master data: ${response.status} ${response.statusText}`
//       );
//     }

//     const chargerMasterData = await response.json();
//     return chargerMasterData;
//   } catch (error) {
//     console.error("Error fetching charger master data:", error);
//     // Handle the error appropriately (e.g., show an error message to the user)
//     return []; // Or you could return null or throw the error further up the call stack
//   }
// };
