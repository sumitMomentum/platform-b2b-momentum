import { capabilities, planCapabilities, plans } from "./seeds/plans";
import { settings } from "./seeds/platform";
import { currencies } from "./seeds/currenciess";
import { permissions } from "./seeds/permissions";
import { modules } from "./seeds/modules";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { paymentsMethods, pricings } from "./seeds/pricing";
import { benefits } from "./seeds/benefits";
import { chargers } from "./seeds/chargers";
import { chargerTypes } from "./seeds/chargerTypes";
import { vehicleActions } from "./seeds/vehicleActions";
import { vehicleChargingDetails } from "./seeds/vehiclesChargingDetails";
import { vehicleDetails } from "./seeds/vehicleDetails";
import { users } from "./seeds/users";
import chalk from "chalk";
import { chargingSessions } from './seeds/chargingSession'
import { tripSessions } from "./seeds/tripSession";

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

async function main() {
  try {
    log.header("Starting Database Seeding");
    log.info("Checking table states...");

    // Check if tables are empty before seeding
    const [
      permissionCount,
      moduleCount,
      currencyCount,
      capabilityCount,
      planCount,
      planCapabilityCount,
      settingCount,
      pricingCount,
      paymentMethodCount,
      vehicleCount,
      benefitCount,
      chargerMasterCount,
      chargerTypeCount,
      actionCount,
      vehicleChargingDetailCount,
      usersCount,
      chargingSessionCount,
      tripSessionCount,
    ] = await Promise.all([
      prisma.permission.count(),
      prisma.module.count(),
      prisma.adminCurrencies.count(),
      prisma.capabilitie.count(),
      prisma.plan.count(),
      prisma.planCapabilities.count(),
      prisma.superAdminSetting.count(),
      prisma.pricing.count(),
      prisma.paymentMethod.count(),
      prisma.vehicle.count(),
      prisma.benefit.count(),
      prisma.chargerMaster.count(),
      prisma.chargerType.count(),
      prisma.action.count(),
      prisma.vehicleChargingDetail.count(),
      prisma.user.count(),
      prisma.chargingSession.count(),
      prisma.vehicleTripSession.count(),
    ]);

    log.subHeader("Starting Seeding Process");

    await prisma.$transaction(async (tx: any) => {
      // if (permissionCount === 0) {
      //   await tx.permission.createMany({ data: permissions });
      //   log.success("Seeded permissions");
      // } else {
      //   log.warning("Permissions table not empty, skipping...");
      // }

      // if (moduleCount === 0) {
      //   await tx.module.createMany({ data: modules });
      //   log.success("Seeded modules");
      // } else {
      //   log.warning("Modules table not empty, skipping...");
      // }

      // if (currencyCount === 0) {
      //   await tx.adminCurrencies.createMany({ data: currencies });
      //   log.success("Seeded currencies");
      // } else {
      //   log.warning("Currencies table not empty, skipping...");
      // }

      // if (capabilityCount === 0) {
      //   await tx.capabilitie.createMany({ data: capabilities });
      //   log.success("Seeded capabilities");
      // } else {
      //   log.warning("Capabilities table not empty, skipping...");
      // }

      // if (planCount === 0) {
      //   await tx.plan.createMany({ data: plans });
      //   log.success("Seeded plans");
      // } else {
      //   log.warning("Plans table not empty, skipping...");
      // }

      // if (planCapabilityCount === 0) {
      //   await tx.planCapabilities.createMany({ data: planCapabilities });
      //   log.success("Seeded plan capabilities");
      // } else {
      //   log.warning("Plan capabilities table not empty, skipping...");
      // }

      // if (settingCount === 0) {
      //   await tx.superAdminSetting.createMany({ data: settings });
      //   log.success("Seeded settings");
      // } else {
      //   log.warning("Settings table not empty, skipping...");
      // }

      // if (pricingCount === 0) {
      //   await tx.pricing.createMany({ data: pricings });
      //   log.success("Seeded pricing");
      // } else {
      //   log.warning("Pricing table not empty, skipping...");
      // }

      // if (paymentMethodCount === 0) {
      //   await tx.paymentMethod.createMany({ data: paymentsMethods });
      //   log.success("Seeded payment methods");
      // } else {
      //   log.warning("Payment methods table not empty, skipping...");
      // }

      if (usersCount === 0) {
        await tx.user.createMany({ data: users });
        log.success("Seeded users");
      } else {
        log.warning("Users table not empty, skipping...");
      }

      if (vehicleCount === 0) {
        await tx.vehicle.createMany({ data: vehicleDetails });
        log.success("Seeded vehicles");
      } else {
        log.warning("Vehicles table not empty, skipping...");
      }

      if (benefitCount === 0) {
        await tx.benefit.createMany({ data: benefits });
        log.success("Seeded benefits");
      } else {
        log.warning("Benefits table not empty, skipping...");
      }

      if (chargerMasterCount === 0) {
        await tx.chargerMaster.createMany({ data: chargers });
        log.success("Seeded charger masters");
      } else {
        log.warning("Charger masters table not empty, skipping...");
      }

      if (chargerTypeCount === 0) {
        await tx.chargerType.createMany({ data: chargerTypes });
        log.success("Seeded charger types");
      } else {
        log.warning("Charger types table not empty, skipping...");
      }

      if (actionCount === 0) {
        await tx.action.createMany({ data: vehicleActions });
        log.success("Seeded vehicle actions");
      } else {
        log.warning("Actions table not empty, skipping...");
      }

      if (chargingSessionCount === 0) {
        await tx.chargingSession.createMany({ data: chargingSessions });
        log.success("Seeded chargingSessions actions");
      } else {
        log.warning("Actions table not empty, skipping...");
      }

      if (tripSessionCount === 0) {
        await tx.VehicleTripSession.createMany({ data: tripSessions });
        log.success("Seeded tripSessions actions");
      } else {
        log.warning("Actions table not empty, skipping...");
      }

      // if (vehicleChargingDetailCount === 0) {
      //   await tx.vehicleChargingDetail.createMany({
      //     data: vehicleChargingDetails,
      //   });
      //   log.success("Seeded vehicle charging details");
      // } else {
      //   log.warning("Vehicle charging details table not empty, skipping...");
      // }
    });

    log.header("Database Seeding Completed Successfully! 🎉");
    log.info(`
      Summary of operations:
      - Checked 15 tables
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
