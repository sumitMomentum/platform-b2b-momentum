"use server";

import chalk from "chalk";
import { log } from "console";
import { headers } from "next/headers";
import { stringify } from "querystring";
import { blue } from "tailwindcss/colors";

export async function getTripSessions(
  params: {
    vehicleId?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<any> {
  // const { vehicleId, page = 1, limit = 10 } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicle/trips`
    );
    // const response = await fetch(
    //   `/api/vehicle/trips?vehicleId=${
    //     vehicleId || ""
    //   }&page=${page}&limit=${limit}`,
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
    console.log(chalk.blue("Final Response Data:"), JSON.stringify(finalResponse, null, 2));
    console.log(chalk.blue("Returning Vehicle Trip Sessions to UI : "));
    console.log(finalResponse);
     return {
       success: true,
       sessions: finalResponse,
       timestamp: new Date().toISOString(),
     };
  } catch (error) {
    console.error("Error fetching trip sessions:", error);
    throw new Error("Failed to fetch trip sessions");
  }
}
