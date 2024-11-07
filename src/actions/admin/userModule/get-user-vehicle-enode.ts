"use server";

import { getEnodeAccessToken } from "@/utils/facades/serverFacades/enodeFacade";
import { getUser } from "@/utils/facades/serverFacades/userFacade";
import { auth } from "@clerk/nextjs/server";

export const getUserVehicleEnode = async () => {
  const userClerk = auth();
  if (!userClerk) throw new Error("client clerk not found");

  const { userId } = await getUser(userClerk);
  const accessToken = await getEnodeAccessToken();
  //   console.log("fetchUser", accessToken, userId);

  if (!accessToken) {
    return;
  }

  const userResponse = await fetch(
    `https://enode-api.sandbox.enode.io/users/${userId}/vehicles`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!userResponse.ok) {
    throw new Error(`Error: ${userResponse.status}`);
  }

  // insert this data into table of postgres

  const userData = await userResponse.json();
  console.log(userData);
  return userData.data;
};
