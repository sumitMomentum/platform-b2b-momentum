"use server";

import chalk from "chalk";
import { headers } from "next/headers";

export async function getTripSessions(
  params: {
    vehicleId?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<any> {
  const { vehicleId, page = 1, limit = 10 } = params;

  try {
    // Construct query parameters if available
    const queryParams: any = {};
    if (vehicleId) queryParams.vehicleId = vehicleId;
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const queryString = new URLSearchParams(queryParams).toString();

    // Construct the API URL with query parameters
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicle/trips?${queryString}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const finalResponse = await response.json();
    console.log(chalk.blue("API Response Status:"), response.status);
    console.log(chalk.blue("API Response Headers:"), response.headers);
    console.log(chalk.blue("Final Response Data:"), JSON.stringify(finalResponse, null, 2));
    console.log(chalk.blue("Returning Vehicle Trip Sessions to UI: "), finalResponse);

    return {
      success: true,
      sessions: finalResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(chalk.red("Error fetching trip sessions:"), error);
    throw new Error("Failed to fetch trip sessions");
  }
}
