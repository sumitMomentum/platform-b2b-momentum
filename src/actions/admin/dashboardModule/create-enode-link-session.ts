"use server";
import { createLinkSession } from "@/utils/facades/serverFacades/enodeFacade";

import { getUser } from "@/utils/facades/serverFacades/userFacade";
import { auth } from "@clerk/nextjs/server";

export const createEnodeLinkSession = async () => {
  const userClerk = await auth();
  if (!userClerk) throw new Error("client clerk not found");

  const { userId } = await getUser(userClerk);
  // console.log("-----------------------------------------------------");
  // console.log("clerk userID", userId);
  // console.log("-----------------------------------------------------");
  return await createLinkSession(userId);
};
