"use server";

import {
  createClerkOrganization,
  handleUpdateDataForUser,
} from "@/utils/facades/serverFacades/clerkFacade";
import { getUser } from "@/utils/facades/serverFacades/userFacade";
import { auth } from "@clerk/nextjs/server";
import chalk from "chalk";

export default async function completeOnboarding(payload: any) {
  const userClerk = await auth();

  if (!userClerk) throw new Error("client clerk not found");
  const { userId } = await getUser(userClerk);

  let organization: any = null;

  console.log(chalk.blue("🚀 Starting onboarding process..."));

  const response = await createClerkOrganization({
    name: payload.applicationName || "",
    createdBy: userClerk.userId,
  })
    .then((data: any) => {
      organization = data;
      console.log(
        chalk.green("✨ Organization created successfully:"),
        organization
      );
    })
    .catch((error) => {
      console.log(chalk.red("❌ Error creating organization:"), error);
      throw new Error("Error creating organization");
    });
  console.log(chalk.cyan("📋 Create Org Response:"), response);

  return await handleUpdateDataForUser({
    scope: "publicMetadata",
    userBdId: userId,
    data: {
      onboardingComplete: true,
      applicationName: payload.applicationName || "", //Some data from the form
    },
  })
    .then(() => {
      console.log(chalk.green("✅ User metadata updated successfully"));
      return JSON.stringify({
        organization,
        message: "ok",
      });
    })
    .catch((error) => {
      console.log(chalk.red("❌ Error updating user metadata:"), error);
      console.error(chalk.red.bold("🔥 Critical Error:"), error);
      return "error";
    });
}
