"use server";

import { brand } from "@/components/ui/landingPage/theme/themePrimitives";
import prisma from "@/lib/db";
import { range } from "@mui/x-data-grid/internals";
import { log, error } from "console";
import crypto from "crypto";
import { create } from "domain";
import { read } from "fs";
import { connect } from "http2";

export const generateEnodeToken = async () => {
  let accessToken = await getEnodeAccessToken();
  return accessToken;
};

export const getEnodeAccessToken = async () => {
  try {
    const token = await prisma.enodeToken.findFirst({
      select: {
        token: true,
        createdAt: true,
      },
    });

    console.log("getAccessToken", token);

    let accessToken = token?.token || "";

    if (
      !accessToken ||
      (token && accessToken && isTokenExpired(token.createdAt))
    ) {
      await prisma.enodeToken.deleteMany();
      accessToken = await generateAccessToken();
      // Save the access token in the EnodeToken table
      const savedToken = await prisma.enodeToken.create({
        data: {
          token: accessToken,
        },
      });
    }

    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Failed to fetch access token");
  }
};

// export const generateAccessToken = async () => {
//   try {
//     // Check if environment variables are defined and have valid values
//     const clientId = process.env.ENODE_CLIENT_ID;
//     const clientSecret = process.env.ENODE_CLIENT_SECRET;
//     const tokenEndpoint = process.env.ENODE_OAUTH_URL;

//     if (!clientId || !clientSecret || !tokenEndpoint) {
//       throw new Error(
//         "Client ID, Client Secret, or Token Endpoint is not defined"
//       );
//     }

//     // Ensure both clientId and clientSecret are strings
//     if (
//       typeof clientId !== "string" ||
//       typeof clientSecret !== "string" ||
//       typeof tokenEndpoint !== "string"
//     ) {
//       throw new Error("Invalid Client ID, Client Secret, or Token Endpoint");
//     }

//     const response = await axios.post(
//       `${tokenEndpoint}/oauth2/token`,
//       "grant_type=client_credentials",
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: `Basic ${Buffer.from(
//             `${clientId}:${clientSecret}`
//           ).toString("base64")}`,
//         },
//       }
//     );

//     const data = response.data;
//     console.log(data);
//     return data.access_token;
//   } catch (error) {
//     console.error("Error generating access token:", error);
//     throw new Error("Failed to generate access token");
//   }
// };
export const generateAccessToken = async () => {
  try {
    // Check if environment variables are defined and have valid values
    const clientId = process.env.ENODE_CLIENT_ID;
    const clientSecret = process.env.ENODE_CLIENT_SECRET;
    const tokenEndpoint = process.env.ENODE_OAUTH_URL;

    if (!clientId || !clientSecret || !tokenEndpoint) {
      throw new Error(
        "Client ID, Client Secret, or Token Endpoint is not defined"
      );
    }

    // Ensure both clientId and clientSecret are strings
    if (
      typeof clientId !== "string" ||
      typeof clientSecret !== "string" ||
      typeof tokenEndpoint !== "string"
    ) {
      throw new Error("Invalid Client ID, Client Secret, or Token Endpoint");
    }

    const response = await fetch(`${tokenEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    console.log(data);
    return data.access_token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new Error("Failed to generate access token");
  }
};

export const isTokenExpired = async (createdAt: Date) => {
  const now = new Date();
  const oneHoursAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hours ago

  return createdAt < oneHoursAgo;
};

export const createLinkSession = async (userId: number) => {
  try {
    // Get the access token
    const accessToken = await getEnodeAccessToken();

    // Check if access token is missing
    if (!accessToken) {
      throw new Error("Access token missing");
    }

    // Prepare the request body
    const requestBody = {
      vendorType: "vehicle",
      scopes: [
        "user:vehicle:discovered",
        "user:vehicle:updated",
        "user:vehicle:deleted",
        "user:vehicle:smart-charging-status-updated",
        "vehicle:read:data",
        "vehicle:read:location",
        "vehicle:control:charging",
        "user:charger:discovered",
        "user:charger:updated",
        "user:charger:deleted",
        "charger:read:data",
        "charger:control:charging",
      ],
      language: "en-US",
      redirectUri: `${process.env.ENODE_VEHICLE_ADD_REDIRECT}`,
    };

    // Make the API call to create the Link session
    const response = await fetch(
      `https://enode-api.sandbox.enode.io/users/${userId}/link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to create Link session: ${response.statusText}`);
    }

    // Extract linkUrl from the response
    const responseData = await response.json();
    const linkUrl = responseData.linkUrl;

    return linkUrl;
  } catch (error) {
    console.error("Error creating Link session:", error);
    throw new Error("Failed to create Link session");
  }
};

export const listWebhook = async () => {
  try {
    const accessToken = await getEnodeAccessToken();

    const response = await fetch(`${process.env.ENODE_API_URL}/webhooks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch webhooks: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error in listing webhook", error);
  }
};

export const runWebhook = async () => {
  try {
    const webhookList = await listWebhook();
    console.log("Webhook List returned", webhookList);
    if (
      webhookList.data.length === 1 &&
      webhookList.data[0].isActive === true &&
      webhookList.data[0].url === `${process.env.NEXT_PUBLIC_URL}/en/api/enode`
    ) {
      return webhookList;
    } else if (webhookList.data.length === 0) {
      const responseData = await createWebHook();
      console.log("response of runWebHook() function: \n", responseData);
    } else if (
      webhookList.data[0].url !== `${process.env.NEXT_PUBLIC_URL}/en/api/enode`
    ) {
      await updateWebhook(webhookList.data[0].id);
    } else if (webhookList.data[0].isActive === false) {
      const responseData = await deleteAndRerunWebHook(webhookList.data[0].id);
      console.log("response of runWebHook() function: \n", responseData);
    }

    return webhookList; // Respond with webhook data
  } catch (error) {
    console.error(
      "Error in setWebhook \n",
      error.message,
      process.env.ENODE_WEBHOOK_SECRET
    );
    // throw new Error("Internal Server Error");
  }
};

export const createWebHook = async () => {
  try {
    const accessToken = await getEnodeAccessToken();
    const data = {
      secret: process.env.ENODE_WEBHOOK_SECRET,
      url: `${process.env.NEXT_PUBLIC_URL}/en/api/enode`,
      apiVersion: "2024-01-01",
      events: ["*"],
    };
    const response = await fetch(`${process.env.ENODE_API_URL}/webhooks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error in creating webhook", error);
    throw new Error("Failed to create webhook");
  }
};

export const deleteAndRerunWebHook = async (id: string) => {
  try {
    await deleteWebhook(id);
    return await runWebhook();
  } catch (error) {
    console.error("Error in deleting webhook and rerunning", error);
    throw new Error("Failed to delete webhook and rerun");
  }
};

export const updateWebhook = async (id) => {
  try {
    const accessToken = await getEnodeAccessToken();

    const data = {
      secret: process.env.ENODE_WEBHOOK_SECRET,
      url: `${process.env.NEXT_PUBLIC_URL}/en/api/enode`,
      apiVersion: "2024-01-01",
      events: ["*"],
    };

    const response = await fetch(
      `${process.env.ENODE_API_URL}/webhooks/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log(
        "Webhook updated successfully",
        responseData,
        process.env.ENODE_WEBHOOK_SECRET
      );
      console.log("webhookId", id);
      return responseData;
    } else {
      console.error("Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("Error in updateWebhook", error);
    console.log("webhookId", id);
  }
};

export const deleteWebhook = async (id: string) => {
  try {
    const accessToken = await getEnodeAccessToken();

    const response = await fetch(
      `${process.env.ENODE_API_URL}/webhooks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete webhook");
    }

    const responseData = await response.json();

    console.log(JSON.stringify(responseData));
    console.log(`Webhook ${id} deleted successfully`);
  } catch (error) {
    console.error(error);
  }
};

export const handleWebhook = async (req: Request) => {
  try {
    // Read headers from the request
    const signature = req.headers.get("x-enode-signature") as
      | string
      | undefined;

    console.log("signature", signature);
    const body = await new Response(req.body).json();
    console.log("req.body", body);
    console.log("webhook secret", process.env.ENODE_WEBHOOK_SECRET);

    const isValidSignature = await verifySignature(
      body,
      signature,
      process.env.ENODE_WEBHOOK_SECRET
    );

    console.log("isValidSignature", isValidSignature);
    if (!isValidSignature) {
      console.error("Invalid signature");
      // res.status(401).json({ error: "Invalid signature" });
      return;
    }

    // Parse webhook payload if it's not already parsed
    const events = body;

    // Process webhook payload
    events.forEach(async (event: any) => {
      await handleEvent(event);
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    // res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to verify the signature
async function verifySignature(
  payload: any,
  signature: string | undefined,
  secret: string
) {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha1", secret);
  const digest = Buffer.from(
    "sha1=" + hmac.update(JSON.stringify(payload)).digest("hex"),
    "utf8"
  );
  const receivedSignature = Buffer.from(signature, "utf8");

  return crypto.timingSafeEqual(
    new Uint8Array(digest),
    new Uint8Array(receivedSignature)
  );
}

// Function to handle each event
export const handleEvent = async (event: any) => {
  try {
    console.log("event:", event);
    console.log("event type:", event.event);

    switch (event.event) {
      case "user:vehicle:discovered": {
        const vehicleData = event.vehicle;

        await prisma.vehicle.create({
          data: {
            id: vehicleData.id,
            vin: vehicleData.information.vin,
            vehicleId: vehicleData.id, // Assuming vehicleId is the same as id
            model: vehicleData.information.model,
            year: vehicleData.information.year,
            batteryCapacity: vehicleData.chargeState.batteryCapacity,
            ownerID: vehicleData.userId,
            soc: vehicleData.chargeState.batteryLevel,
            dateOfConnection: new Date(), // Set to the current date
            odometerFloat: vehicleData.odometer.distance,
            usageAverageDailyKmDriven: [], // Populate this as needed
            monthlyUsage: [], // Populate this as needed
            condition: "New", // Set an initial condition
            status: vehicleData.isReachable ? "Active" : "Inactive",
            make: vehicleData.vendor,
            batteryHealthSoH: null, // Set as needed
            batteryHealthDegradation: null, // Set as needed
            location: `${vehicleData.location.latitude}, ${vehicleData.location.longitude}`, // Or any specific location string
            soh: [], // Set as needed
            batteryHealthAverageEstimatedDegradation: [], // Set as needed
            batteryHealthAverageSoC: null, // Set as needed
            batteryHealthTotalBatteries: null, // Set as needed
            connectorType: null, // Set as needed
            endOfLife: null, // Set as needed
            realRangeObserved: vehicleData.chargeState.range,
            remainingUsefulLife: null, // Set as needed
            totalChargingSession: 0, // Initial count
            totalEnergyConsumed: null, // Set as needed
            vehicleConditionCritical: 0, // Initial count
            vehicleConditionGood: 0, // Initial count
            vehicleConditionSatisfactory: 0, // Initial count
            vehicleStatusActive: vehicleData.isReachable ? 1 : 0,
            vehicleStatusCharging: vehicleData.chargeState.isCharging ? 1 : 0,
            vehicleStatusInUse: 0, // Set as needed
            vehicleStatusOutOfService: 0, // Set as needed
            epawltpProvidedRange: null, // Set as needed
            usageRangeObservedMax: null, // Set as needed
            usageRangeObservedMin: null, // Set as needed
            usageSoCRangeMax: null, // Set as needed
            usageSoCRangeMin: null, // Set as needed
            usageTemperatureHigh: null, // Set as needed
            usageTemperatureLow: null, // Set as needed
            batteryChemistry: null, // Set as needed
            batteryHealthAverageSoH: null, // Set as needed
            dataPointsCollected: 0, // Initial count
            averageMonthlyUsage: null, // Set as
            owner: {
              connect: { id: 2 }, // Instead of ownerID: 2
            },
          },
        });
        break;
      }

      case "user:vehicle:updated": {
        const updatedVehicle = event.vehicle;

        const existingVehicle = await prisma.vehicle.findUnique({
          where: { id: updatedVehicle.id },
        });

        if (!existingVehicle) {
          console.error(
            "Vehicle not found in the database:",
            updatedVehicle.id
          );
          return;
        }

        // Update vehicle data
        const updatedFields: any = {};

        if (
          updatedVehicle.odometer?.distance !== existingVehicle.odometerFloat
        ) {
          updatedFields.odometerFloat = updatedVehicle.odometer.distance;
        }
        if (
          updatedVehicle.chargeState?.batteryCapacity !==
          existingVehicle.batteryCapacity
        ) {
          updatedFields.batteryCapacity =
            updatedVehicle.chargeState.batteryCapacity;
        }
        if (updatedVehicle.chargeState?.batteryLevel !== existingVehicle.soc) {
          updatedFields.soc = updatedVehicle.chargeState.batteryLevel;
        }

        if (Object.keys(updatedFields).length > 0) {
          updatedFields.updatedAt = new Date();

          const updatedVehicleData = await prisma.vehicle.update({
            where: { id: updatedVehicle.id },
            data: updatedFields,
          });

          console.log("Vehicle information updated:", updatedVehicleData);
        } else {
          console.log("No changes detected for vehicle:", updatedVehicle.id);
        }
        break;
      }

      // Delete vehicle from single table
      case "user:vehicle:deleted": {
        const vehicle = event.vehicle;

        const deletedVehicle = await prisma.vehicle.delete({
          where: { id: vehicle.id },
        });

        console.log("Vehicle deleted:", deletedVehicle);
        break;
      }

      case "user:charger:discovered": {
        const charger = event.charger;

        const createdCharger = await prisma.chargerMaster.create({
          data: {
            chargerID: charger.id,
            chargerLocation: `${charger.location.latitude},${charger.location.longitude}`, // Ensure location is provided
            chargerStatus: charger.isReachable ? "Active" : "Inactive",
            dateJoining: new Date(), // Set the current date as the joining date
            chargeType: charger.chargeState.isCharging
              ? "Default"
              : "Not Available", // Customize based on your requirements
            chargingPoint: charger.information.model, // Adjust this based on actual data structure
          },
        });

        console.log("Charger created:", createdCharger);
        break;
      }

      case "user:charger:deleted": {
        const charger = event.charger;

        const deletedCharger = await prisma.chargerMaster.delete({
          where: { chargerID: charger.id },
        });

        console.log("Charger deleted:", deletedCharger);
        break;
      }

      default:
        console.log("Skipping event:", event.event);
        break;
    }
  } catch (error) {
    console.error("Error handling events:", error);
  }
};

// export const handleEvent = async (event: any) => {
//   try {
//     console.log("event:", event);
//     console.log("event type:", event.event);

//     // Check if the event contains vehicle information
//     if (event.event === "user:vehicle:discovered") {
//       // Parse and extract vehicle information from the event
//       const vehicle = event.vehicle; // Assuming vehicleInfo is provided in the event

//       // Save vehicle information to the database
//       const savedVehicle = await prisma.vehicle.create({
//         data: {
//           id: String(vehicle.id),
//           make: vehicle.information.brand,
//           model: vehicle.information.model,
//           year: vehicle.information.year,
//           vin: vehicle.information.vin,
//           odometerFloat: vehicle.odometer.distance,
//           batteryCapacity: vehicle.chargeState.batteryCapacity,
//           owner: { connect: { id: parseInt(vehicle.userId) } },
//           dateOfConnection: new Date(),
//           soc: vehicle.chargeState.batteryLevel,
//         },
//       });

//       // Check if vehicleId is empty
//       if (savedVehicle.id) {
//         // Find the first VehicleDashboardData entry where vehicleId is empty
//         const dashboardData = await prisma.vehicle.findFirst({
//           where: { vehicleId: null },
//         });
//         // const dashboardData = await prisma.vehicleDashboardData.findFirst({
//         //   where: { vehicleId: null },
//         // });

//         console.log("dashboard data", dashboardData);

//         // Update its vehicleId field with the newly saved Vehicle id
//         if (dashboardData) {
//           // const updatedDashboardData = await prisma.vehicleDashboardData.update(
//           const updatedDashboardData = await prisma.vehicle.update({
//             where: { id: dashboardData.id },
//             data: { vehicleId: savedVehicle.id },
//           });

//           console.log("updatedDashboardData", updatedDashboardData);
//         }
//       }

//       console.log("Vehicle information saved:", savedVehicle);
//     } else if (event.event === "user:vehicle:updated") {
//       // Parse and extract vehicle information from the event
//       const updatedVehicle = event.vehicle;

//       // Retrieve existing vehicle data from the database
//       const existingVehicle = await prisma.vehicle.findUnique({
//         where: {
//           id: updatedVehicle.id,
//         },
//       });

//       if (!existingVehicle) {
//         console.error("Vehicle not found in the database:", updatedVehicle.id);
//         return;
//       }

//       // Compare received vehicle data with existing data
//       const hasOdometerChange =
//         updatedVehicle.odometerFloat.distance !==
//         existingVehicle.odometerFloat;
//       const hasBatteryCapacityChange =
//         updatedVehicle.chargeState.batteryCapacity !==
//         existingVehicle.batteryCapacity;
//       const hasSocChange =
//         updatedVehicle.chargeState.batteryLevel !== existingVehicle.soc;

//       if (hasOdometerChange || hasBatteryCapacityChange) {
//         // Update the vehicle data in the database
//         const updatedFields: any = {};
//         if (hasOdometerChange) {
//           updatedFields.odometer = updatedVehicle.odometer.distance;
//         }
//         if (hasBatteryCapacityChange) {
//           updatedFields.batteryCapacity =
//             updatedVehicle.chargeState.batteryCapacity;
//         }
//         if (hasSocChange) {
//           updatedFields.soc = updatedVehicle.chargeState.batteryLevel;
//         }

//         updatedFields.updatedAt = new Date();

//         const updatedVehicleData = await prisma.vehicle.update({
//           where: {
//             id: updatedVehicle.id,
//           },
//           data: updatedFields,
//         });

//         console.log("Vehicle information updated:", updatedVehicleData);
//       } else {
//         console.log("No changes detected for vehicle:", updatedVehicle.id);
//       }
//     } else if (event.event === "user:vehicle:deleted") {
//       // Extract the vehicle ID from the event
//       const vehicle = event.vehicle;

//       // Delete the vehicle from the database
//       const deletedVehicle = await prisma.vehicle.delete({
//         where: {
//           id: vehicle.id,
//         },
//       });

//       console.log("Vehicle deleted:", deletedVehicle);
//     } else {
//       console.log("Skipping event:", event.event);
//     }
//   } catch (error) {
//     console.error("Error handling events:", error);
//   }
// };
