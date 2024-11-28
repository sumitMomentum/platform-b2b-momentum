import chalk from "chalk";
import {
  handleEventWebhook,
  validateClerkRequest,
} from "@/utils/facades/serverFacades/clerkFacade";

export async function POST(request: Request) {
  console.log(chalk.blue("📥 Received webhook POST request"));

  try {
    console.log(chalk.cyan("🔐 Validating Clerk request"));
    const payload = await validateClerkRequest(request);
    console.log(chalk.green("✅ Request validated successfully"));

    console.log(chalk.cyan("🔄 Processing webhook event"));
    await handleEventWebhook(payload);
    console.log(chalk.green("✅ Webhook processed successfully"));
  } catch (error) {
    console.log(chalk.red("❌ Error processing webhook:"), error);
    console.error(error);
  }

  console.log(chalk.blue("📤 Sending response"));
  return Response.json({ message: "Received" });
}
