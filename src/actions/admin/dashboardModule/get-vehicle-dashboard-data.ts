
import { auth } from "@clerk/nextjs";

export const getVehicleDashboardData = async (vehicleId: string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("Hey")

  // Fetch the vehicle data from the API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}` + `/api/vehicle/${vehicleId}`);

  console.log(response)

  if (!response.ok) {
    throw new Error("Failed to fetch vehicle data");
  }

  return await response.json();
};


// "use server";
// import prisma from "@/lib/db";
// import { auth } from "@climport { ok } from "assert";

// export const getVehicleDashboardData = async (vehicleId: string) => {
//   const userClerk = auth();
//   if (!userClerk) throw new Error("client clerk not found");

//   let response = await fetch(
//     `https://demoapi-9d35.onrender.com/api/vehicles?vehicleId=${vehicleId}&step=details`
//   );

//   if (!response.ok) {
//     // Check if both responses are successful
//     throw new Error(
//       `Error fetching data: ${response.status} ${response.statusText}`
//     );
//   }

//   response = await response.json();

//   return response;
// };

// function getRandomFutureDate(minYears, maxYears) {
//   const today = new Date();
//   const yearsToAdd = Math.random() * (maxYears - minYears) + minYears;
//   const futureDate = new Date(today);
//   futureDate.setFullYear(futureDate.getFullYear() + yearsToAdd);
//   return futureDate;
// }
