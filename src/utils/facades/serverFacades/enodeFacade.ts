"use server";

import prisma from "@/lib/db";
import crypto from "crypto";

let ENODE_WEBHOOK_SECRET =
  "24rwetfwertvwcedrterw3456eb5ur5yfw3d4rq456be567wc345tew45xtw45wx34q3";
const WEBHOOK_SECRET =
  "24rwetfwertvwcedrterw3456eb5ur5yfw3d4rq456be567wc345tew45xtw45wx34q3";

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
      let accessToken = await generateAccessToken();
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

    const response = await fetch(`${tokenEndpoint}/oauth2/token`, {
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

export const isTokenExpired = (createdAt: Date): boolean => {
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
        "vehicle:read:data",
        "vehicle:read:location",
        "vehicle:control:charging",
      ],
      language: "en-US",
      redirectUri: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/en/home/vehicles`,
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
      ENODE_WEBHOOK_SECRET
    );
    // throw new Error("Internal Server Error");
  }
};

export const createWebHook = async () => {
  try {
    const accessToken = await getEnodeAccessToken();
    const data = {
      secret: ENODE_WEBHOOK_SECRET,
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
      secret: ENODE_WEBHOOK_SECRET,
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
        ENODE_WEBHOOK_SECRET
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
    console.log("webhook secret", WEBHOOK_SECRET);

    const isValidSignature = await verifySignature(
      body,
      signature,
      WEBHOOK_SECRET
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

  return crypto.timingSafeEqual(digest, receivedSignature);
}

// Function to handle each event
export const handleEvent = async (event: any) => {
  try {
    console.log("event:", event);
    console.log("event type:", event.event);

    // Check if the event contains vehicle information
    if (event.event === "user:vehicle:discovered") {
      // Parse and extract vehicle information from the event
      const vehicle = event.vehicle; // Assuming vehicleInfo is provided in the event

      // Save vehicle information to the database
      const savedVehicle = await prisma.vehicle.create({
        data: {
          id: vehicle.id,
          make: vehicle.information.brand,
          model: vehicle.information.model,
          year: vehicle.information.year,
          vin: vehicle.information.vin,
          odometer: vehicle.odometer.distance,
          batteryCapacity: vehicle.chargeState.batteryCapacity,
          owner: { connect: { id: parseInt(vehicle.userId) } },
          dateOfConnection: new Date(),
          soc: vehicle.chargeState.batteryLevel,
        },
      });

      // Check if vehicleId is empty
      if (savedVehicle.id) {
        // Find the first VehicleDashboardData entry where vehicleId is empty
        const dashboardData = await prisma.vehicleDashboardData.findFirst({
          where: { vehicleId: null },
        });

        console.log("dashboard data", dashboardData);

        // Update its vehicleId field with the newly saved Vehicle id
        if (dashboardData) {
          const updatedDashboardData = await prisma.vehicleDashboardData.update(
            {
              where: { id: dashboardData.id },
              data: { vehicleId: savedVehicle.id },
            }
          );

          console.log("updatedDashboardData", updatedDashboardData);
        }
      }

      console.log("Vehicle information saved:", savedVehicle);
    } else if (event.event === "user:vehicle:updated") {
      // Parse and extract vehicle information from the event
      const updatedVehicle = event.vehicle;

      // Retrieve existing vehicle data from the database
      const existingVehicle = await prisma.vehicle.findUnique({
        where: {
          id: updatedVehicle.id,
        },
      });

      if (!existingVehicle) {
        console.error("Vehicle not found in the database:", updatedVehicle.id);
        return;
      }

      // Compare received vehicle data with existing data
      const hasOdometerChange =
        updatedVehicle.odometer.distance !== existingVehicle.odometer;
      const hasBatteryCapacityChange =
        updatedVehicle.chargeState.batteryCapacity !==
        existingVehicle.batteryCapacity;
      const hasSocChange =
        updatedVehicle.chargeState.batteryLevel !== existingVehicle.soc;

      if (hasOdometerChange || hasBatteryCapacityChange) {
        // Update the vehicle data in the database
        const updatedFields: any = {};
        if (hasOdometerChange) {
          updatedFields.odometer = updatedVehicle.odometer.distance;
        }
        if (hasBatteryCapacityChange) {
          updatedFields.batteryCapacity =
            updatedVehicle.chargeState.batteryCapacity;
        }
        if (hasSocChange) {
          updatedFields.soc = updatedVehicle.chargeState.batteryLevel;
        }

        updatedFields.updatedAt = new Date();

        const updatedVehicleData = await prisma.vehicle.update({
          where: {
            id: updatedVehicle.id,
          },
          data: updatedFields,
        });

        console.log("Vehicle information updated:", updatedVehicleData);
      } else {
        console.log("No changes detected for vehicle:", updatedVehicle.id);
      }
    } else if (event.event === "user:vehicle:deleted") {
      // Extract the vehicle ID from the event
      const vehicle = event.vehicle;

      // Delete the vehicle from the database
      const deletedVehicle = await prisma.vehicle.delete({
        where: {
          id: vehicle.id,
        },
      });

      console.log("Vehicle deleted:", deletedVehicle);
    } else {
      console.log("Skipping event:", event.event);
    }
  } catch (error) {
    console.error("Error handling events:", error);
  }
};
