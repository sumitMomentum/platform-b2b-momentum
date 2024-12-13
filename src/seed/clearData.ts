import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();
const prisma = new PrismaClient();

const log = {
  info: (msg: string) => console.log(chalk.blue("ℹ ") + msg),
  success: (msg: string) => console.log(chalk.green("✓ ") + msg),
  warning: (msg: string) => console.log(chalk.yellow("⚠ ") + msg),
  error: (msg: string) => console.log(chalk.red("✖ ") + msg),
  header: (msg: string) =>
    console.log(
      "\n" +
        chalk.cyan("=".repeat(50)) +
        "\n" +
        chalk.cyan.bold(msg) +
        "\n" +
        chalk.cyan("=".repeat(50))
    ),
  subHeader: (msg: string) =>
    console.log(
      "\n" +
        chalk.gray("-".repeat(40)) +
        "\n" +
        chalk.gray.bold(msg) +
        "\n" +
        chalk.gray("-".repeat(40))
    ),
};

async function clearData() {
  try {
    log.header("Starting Data Clearance");

    await prisma.$transaction(async (tx) => {
      await tx.chargingSession.deleteMany({});
      await tx.vehicleTripSession.deleteMany({});
      await tx.benefit.deleteMany({});
      await tx.vehicle.deleteMany({});
      await tx.chargerMaster.deleteMany({});
      await tx.chargerType.deleteMany({});
      await tx.action.deleteMany({});
    });

    log.header("Data Clearance Completed Successfully! 🎉");
    log.info("All specified tables have been cleared.");
  } catch (error) {
    log.error("Error during data clearance:");
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearData()
  .then(() => log.success("Database connection closed successfully"))
  .catch((e) => {
    log.error("Fatal error occurred:");
    console.error(e);
    process.exit(1);
  });
