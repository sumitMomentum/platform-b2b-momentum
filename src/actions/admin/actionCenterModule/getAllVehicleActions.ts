"use server";

import { auth } from "@clerk/nextjs";

export const getAllVehicleActions = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch the vehicle actions data from the API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicleActions`
  ); // Use the correct base URL

  if (!response.ok) {
    throw new Error("Failed to fetch vehicle actions data");
  }

  return await response.json();
};

// export const getVehicleActions =import { ok } from "assert";
//   try {
//     const response = await fetch(
//       `https://demoapi-9d35.onrender.com/api/vehicles/allVehiclesStep3`
//     );
//     // `${process.env.BACKEND_URL}/api/vehicles/allVehiclesStep3`

//     if (!response.ok) {
//       throw new Error(
//         `Error fetching step 3 data: ${response.status} ${response.statusText}`
//       );
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching step 3 data:", error);
//     // Handle error (e.g., show error message to the user)
//     return []; // Or return an error object
//   }
// };
