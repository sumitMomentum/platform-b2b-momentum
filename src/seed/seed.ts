import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import chalk from "chalk";
import { data as chargingSessions } from "./seeds/chargingSessions";
import { data as tripSessions } from "./seeds/vehicleTripSessions";
import { benefits } from "./seeds/benefits";
import { users } from "./seeds/users";
import { vehicleDetails } from "./seeds/vehicleDetails";
import { chargerTypes } from "./seeds/chargerTypes";
import { chargers } from "./seeds/chargers";
import { vehicleActions } from "./seeds/vehicleActions";

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

// Generate a unique Trip ID if it's missing
function generateTripID() {
  return Math.floor(Math.random() * 1000000); // Customize this as needed
}

async function seedChargingSessions() {
  for (const row of chargingSessions) {
    await prisma.chargingSession.create({
      data: {
        TripID: row.TripID,
        DteStart: row.DteStart,
        DteEnd: row.DteEnd,
        BatteryAtStart: row.BatteryAtStart,
        BatteryAtEnd: row.BatteryAtEnd,
        DwUpdated: row.DwUpdated,
        DiffInBat: row.DiffInBat,
        ChargingType: row.ChargingType, // Corrected to match the schema
        DiffInDte: row.DiffInDte,
        chargerId: row.chargerId, // Updated field name
        vehicleId: row.vehicleId, // Updated field name
      },
    });        
  }
  log.success('Charging sessions seeded successfully.');
}

async function seedVehicleTripSessions() {
  for (const row of tripSessions) {
    await prisma.vehicleTripSession.create({
      data: {
        TripID: row.TripID || generateTripID(),
        DteStart: row.DteStart,
        DteEnd: row.DteEnd,
        BatteryAtStart: row.BatteryAtStart,
        BatteryAtEnd: row.BatteryAtEnd,
        DwUpdated: row.DwUpdated,
        TripApprovedKilometer: row.TripApprovedKilometer,
        DiffInBat: row.DiffInBat,
        DiffInDte: row.DiffInDte,
        vehicleId: row.vehicleId, // Updated to match the schema
      },
    });        
  }
  log.success('Vehicle trip sessions seeded successfully.');
}

async function main() {
  try {
    log.header("Starting Database Seeding");
    log.info("Checking table states...");

    // Empty the tables before seeding
    await prisma.$transaction([
      prisma.chargingSession.deleteMany(),
      prisma.vehicleTripSession.deleteMany(),
      prisma.action.deleteMany(),
      prisma.chargerType.deleteMany(),
      prisma.chargerMaster.deleteMany(),
      prisma.benefit.deleteMany(),
      prisma.vehicle.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    log.subHeader("Starting Seeding Process");

    await prisma.$transaction(async (tx) => {
      await tx.user.createMany({ data: users });
      log.success("Seeded users");

      await tx.vehicle.createMany({ data: vehicleDetails });
      log.success("Seeded vehicles");

      await tx.benefit.createMany({ data: benefits });
      log.success("Seeded benefits");

      await tx.chargerMaster.createMany({ data: chargers });
      log.success("Seeded charger masters");

      await tx.chargerType.createMany({ data: chargerTypes });
      log.success("Seeded charger types");

      await tx.action.createMany({ data: vehicleActions });
      log.success("Seeded vehicle actions");

      await seedChargingSessions();
      await seedVehicleTripSessions();
    });

    log.header("Database Seeding Completed Successfully! 🎉");
    log.info(`
      Summary of operations:
      - Checked tables
      - Seeded empty tables
      - Skipped existing data
      - All operations completed successfully
    `);
  } catch (error) {
    log.error("Error during seeding:");
    console.error(error);
    throw error;
  }
}

main()
  .then(async () => {
    log.success("Database connection closed successfully");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    log.error("Fatal error occurred:");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
  