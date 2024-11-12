"use server"

import { auth } from "@clerk/nextjs/server";


export const getVehicleBenefits = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch the benefits data from the API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/benefits`
  );

  console.log(response)

  if (!response.ok) {
    throw new Error("Failed to fetch benefits data");
  }

  return await response.json();
};

// export const getVehicleBenefitsimport { ok } from "assert";
//   try {
//     console.log(`${process.env.BACKEND_URL}/api/vehicles/allVehiclesStep7`);       

//     const response = await fetch(
//       `https://demoapi-9d35.onrender.com/api/vehicles/allVehiclesStep7`
//     );


//     if (!response.ok) {
//       throw new Error(
//         `Error fetching step 3 data: ${response.status} ${response.statusText}`
//       );
//     }
//     const data = await response.json();
//     console.log(data)
//     return data;
//   } catch (error) {
//     console.error("Error fetching step 7 data:", error);
//     // Handle error (e.g., show error message to the user)
//     return []; // Or return an error object
//   }
// };
