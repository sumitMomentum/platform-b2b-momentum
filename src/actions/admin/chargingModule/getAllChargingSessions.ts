"use server";

import chalk from "chalk";

export async function getChargingSessions(vehicleId?: string): Promise<any> {
  try {
    // Construct the query parameters
    const queryParams: any = vehicleId ? { vehicleId } : {};
    const queryString = new URLSearchParams(queryParams).toString();

    // Fetch data from the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/charger/sessions`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response JSON
    const finalResponse = await response.json();

    // Log response details
    console.log(chalk.blue("API Response Status:"), response.status);
    // console.log(chalk.blue("Final Response Data:"), JSON.stringify(finalResponse, null, 2));
    console.log(chalk.blue("Returning Charging Sessions to UI : "), {
      success: true,
      sessions: finalResponse,
      timestamp: new Date().toISOString(),
    });

    // Return the parsed data
    return {
      success: true,
      sessions: finalResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // Log error with context
    console.error(chalk.red("Charging Sessions Error:"), {
      errorMessage: error.message,
      vehicleId,  // Including vehicleId in the error log for context
      stack: error.stack
    });

    // Rethrow error
    throw new Error(`Failed to fetch charging sessions: ${error.message}`);
  }
}
