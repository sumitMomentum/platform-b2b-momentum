"use server";
import chalk from "chalk";
import { runWebhook } from "@/utils/facades/serverFacades/enodeFacade";
import { getUser } from "@/utils/facades/serverFacades/userFacade";
import { auth } from "@clerk/nextjs/server";

export const createEnodeWebhook = async () => {
  console.log(chalk.blue("🚀 Starting Enode webhook creation"));

  try {
    console.log(chalk.cyan("🔐 Verifying Clerk authentication"));
    const userClerk = await auth();

    if (!userClerk) {
      console.log(chalk.red("❌ Clerk authentication failed"));
      throw new Error("client clerk not found");
    }
    console.log(chalk.green("✅ Clerk authentication successful"));

    console.log(chalk.cyan("🔄 Running webhook"));
    const result = await runWebhook();
    console.log(chalk.green("✅ Webhook executed successfully"));

    return result;
  } catch (error) {
    console.log(chalk.red("❌ Error in createEnodeWebhook:"), error);
    throw error;
  }
};
