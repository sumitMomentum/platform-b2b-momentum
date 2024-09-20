"use server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { getUser } from "@/utils/facades/serverFacades/userFacade";

// export const getUserVehicles = async () => {
//   const userClerk = auth();

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

// export const getUserVehicles = async () => {
//   try {
//     const response = await fetch(
//       "https://demoapi-9d35.onrender.com/api/vehicles/allVehicleDetails"
//     );

//     const response2 = await fetch(
//       "https://demoapi-9d35.onrender.com/api/vehicles//allVehiclesStep2"
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Error fetching step 1 data: ${response.status} ${response.statusText}`
//       );
//     }

//     const realData = await response.json();

//     const updatedData = realData.map((realVehicle, index) => {
//       const newFields = {
//         batteryHealth: Array.from({ length: 12 }, (_, i) =>
//           i < 3 || i > 8 ? Math.floor(Math.random() * 5) + 95 : 0
//         ),
//       };

//       return { ...realVehicle, ...newFields }; // No need to merge with fakeData since we're generating all fields
//     });

//     return updatedData;
//   } catch (error) {
//     console.error("Error fetching or updating data:", error);
//     return [];
//   }
// };

export const getUserVehicles = async () => {
  try {
    const response1 = await fetch(
      `${process.env.NEXT_BASE_URL}/api/vehicles/allVehicleDetails`
    );
    const response2 = await fetch(
      `${process.env.NEXT_BASE_URL}/api/vehicles/allVehiclesStep2`
    );

    if (!response1.ok || !response2.ok) {
      throw new Error(
        `Error fetching data: ${response1.status} ${response1.statusText}, ${response2.status} ${response2.statusText}`
      );
    }

    const vehicleDetailsData = await response1.json();
    const step2Data = await response2.json();

    // Create a map for efficient lookup by vehicleId
    const step2DataMap = new Map(
      step2Data.map((item) => [item.vehicleId, item])
    );

    const updatedData = vehicleDetailsData.map((vehicleDetail) => {
      const step2Vehicle = step2DataMap.get(vehicleDetail.vehicleId);

      if (step2Vehicle) {
        // Merge data, prioritizing Step2 values
        const mergedVehicle = { ...vehicleDetail, ...(step2Vehicle as object) };

        // Add fake batteryHealth if not present in either response
        if (!mergedVehicle.batteryHealth && !mergedVehicle.soh) {
          mergedVehicle.batteryHealth = Array.from({ length: 12 }, (_, i) =>
            i < 3 || i > 8 ? Math.floor(Math.random() * 5) + 95 : 0
          );
        }

        return mergedVehicle;
      } else return vehicleDetail;
    });

    // console.log(updatedData);

    return updatedData;
  } catch (error) {
    console.error("Error fetching or updating data:", error);
    return [];
  }
};
