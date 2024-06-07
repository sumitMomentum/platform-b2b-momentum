"use server"
import { runWebhook } from "@/utils/facades/serverFacades/enodeFacade";

import { getUser } from "@/utils/facades/serverFacades/userFacade";
import { auth } from "@clerk/nextjs";

export const createEnodeWebhook = async () => {
  const userClerk = auth();
  if (!userClerk) throw new Error("client clerk not found");

  return await runWebhook();
};