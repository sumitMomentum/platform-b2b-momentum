"use server";

import { auth } from "@clerk/nextjs/server";
import { ok } from "assert";
import chalk from "chalk";
import { log } from "console";
import { url } from "inspector";
import { headers } from "next/headers";
import { env } from "process";
import { cache } from "react";
import { blue, red } from "tailwindcss/colors";

export const getVehicleDashboardData = async (vehicleId: string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log(chalk.blue("Attempting to fetch vehicle:", vehicleId));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicle/${vehicleId}`
  );
  // Log the response URL to check for redirects
  console.log(chalk.blue("Response URL:", response.url));

  if (response.url.includes("sign-in")) {
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    console.log(chalk.red(`Failed with status: ${response.status}`));
    const text = await response.text(); // Get the actual response body
    console.log(chalk.red("Response:", text));
    throw new Error(`Failed to fetch vehicle data: ${response.status}`);
  }

  const finalResponse = await response.json();
  console.log(finalResponse);

  return finalResponse;
};
