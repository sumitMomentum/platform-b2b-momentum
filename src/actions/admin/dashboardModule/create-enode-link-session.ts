"use server"
import { createLinkSession } from "@/utils/facades/serverFacades/enodeFacade";

import { getUser } from "@/utils/facades/serverFacades/userFacade";
import { auth } from "@clerk/nextjs";

export const createEnodeLinkSession = async () => {
  const userClerk = auth();
  if (!userClerk) throw new Error("client clerk not found");

  const { userId } = await getUser(userClerk);
  return await createLinkSession(userId);
};
