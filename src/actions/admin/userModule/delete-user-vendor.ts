"use server"
import { getEnodeAccessToken } from "@/utils/facades/serverFacades/enodeFacade";
import { getUser } from "@/utils/facades/serverFacades/userFacade";
import { auth } from "@clerk/nextjs";

export const deleteUserVendor = async (vendorId: string) => {
  const userClerk = auth();
  if (!userClerk) throw new Error("client clerk not found");
  const { userId } = await getUser(userClerk);
  const accessToken = await getEnodeAccessToken();

  if (!accessToken) {
    return;
  }

  const userResponse = await fetch(
    `https://enode-api.sandbox.enode.io/users/${userId}/vendors/${vendorId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!userResponse.ok) {
    throw new Error(`Error: ${userResponse.status}`);
  }
};


