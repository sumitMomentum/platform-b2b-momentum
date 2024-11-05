"use server";

import chalk from "chalk";
import { headers } from "next/headers";
import { env } from "process";
import { red } from "tailwindcss/colors";

export async function getChargingSessions(vehicleId?: string): Promise<any> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/charger/sessions`
    );
    // const response = await fetch(
    //   `/api/charger/chargingSessions${
    //     vehicleId ? `?vehicleId=${vehicleId}` : ""
    //   }`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const finalResponse = await response.json();
    console.log(chalk.blue("API Response Status:"), response.status);
    console.log(chalk.blue("API Response Headers:"), response.headers);
    console.log(
      chalk.blue("Final Response Data:"),
      JSON.stringify(finalResponse, null, 2)
    );
    console.log(chalk.blue("Returning Vehicle Trip Sessions to UI : "));
    console.log({
      success: true,
      sessions: finalResponse,
      timestamp: new Date().toISOString(),
    });
    return {
      success: true,
      sessions: finalResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(chalk.red("Charging Sessions Error:"), error);
    throw new Error(`Failed to fetch charging sessions: ${error.message}`);
  }
}
