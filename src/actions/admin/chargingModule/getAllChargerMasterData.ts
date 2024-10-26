"use server";

import { auth } from "@clerk/nextjs";

export const getAllChargerMasterData = async () => {
  // const { userId } = auth();

  // if (!userId) {
  //   throw new Error("Unauthorized");
  // }

  // Fetch the chargers data from the API
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/charger`
  // );

  // console.log(response.json());

  // if (!response.ok) {
  //   throw new Error("Failed to fetch chargers data");
  // }

  // return await response.json();

  return [
    {
      id: 8,
      chargerID: 518652,
      chargerLocation: "12.80,77.71",
      chargerStatus: "Active",
      dateJoining: "2023-02-26T00:00:00.000Z",
      chargeType: "Normal Charging",
      chargingPoint: "BEVC-DC001",
    },
  ];
};
