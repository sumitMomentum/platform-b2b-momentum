"use server";

import { brand } from "@/components/ui/landingPage/theme/themePrimitives";
import prisma from "@/lib/db";
import { range } from "@mui/x-data-grid/internals";
import { log, error } from "console";
import crypto, { createHmac, timingSafeEqual } from "crypto";
import { create } from "domain";
import { read } from "fs";
import { connect } from "http2";
import chalk, {
  blue,
  bold,
  cyan,
  green,
  greenBright,
  magenta,
  red,
  redBright,
  yellow,
} from "chalk";
import { auth } from "@clerk/nextjs";
import { ok } from "assert";
import { headers } from "next/headers";
import { env } from "process";
import { json, text } from "stream/consumers";
import { from } from "svix/dist/openapi/rxjsStub";
import { parse, stringify } from "querystring";
import { url } from "inspector";
import { get } from "http";
import { isArray } from "util";
import useVehicleStore from "@/states/store";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";

export const generateEnodeToken = async () => {
  console.log(chalk.blue("📡 Initiating Enode token generation..."));

  try {
    let accessToken = await getEnodeAccessToken();

    if (!accessToken) {
      console.log(chalk.yellow("⚠️ No access token received"));
      throw new Error("Failed to generate access token");
    }

    console.log(chalk.green("✅ Enode token generated successfully"));
    return accessToken;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error generating Enode token:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    throw new Error(
      `Failed to generate Enode token: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getEnodeAccessToken = async () => {
  console.log(chalk.blue("🔍 Checking for existing Enode access token..."));

  try {
    const token = await prisma.enodeToken.findFirst({
      select: {
        token: true,
        createdAt: true,
      },
    });

    console.log(
      chalk.cyan(
        "💫 Retrieved token from database:",
        token ? "✅ Found" : "⚠️ Not found"
      )
    );

    let accessToken = token?.token || "";

    if (
      !accessToken ||
      (token && accessToken && isTokenExpired(token.createdAt))
    ) {
      console.log(
        chalk.yellow("⚠️ Token is missing or expired. Generating new token...")
      );

      await prisma.enodeToken.deleteMany();
      console.log(chalk.blue("🗑️ Cleared old tokens from database"));

      accessToken = await generateAccessToken();
      console.log(chalk.blue("🔄 Generated new access token"));

      const savedToken = await prisma.enodeToken.create({
        data: {
          token: accessToken,
        },
      });
      console.log(chalk.green("✅ New token saved to database"));
    } else {
      console.log(chalk.green("✅ Using existing valid token"));
    }

    return accessToken;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error in getEnodeAccessToken:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw new Error(
      `Failed to fetch access token: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
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
//     console.warn("Error generating access token:", error);
//     throw new Error("Failed to generate access token");
//   }
// };
export const generateAccessToken = async () => {
  console.log(chalk.blue("🔐 Initiating access token generation..."));

  try {
    // Check if environment variables are defined and have valid values
    const clientId = process.env.ENODE_CLIENT_ID;
    const clientSecret = process.env.ENODE_CLIENT_SECRET;
    const tokenEndpoint = process.env.ENODE_OAUTH_URL;

    // Validate environment variables
    console.log(chalk.blue("🔍 Validating environment variables..."));
    if (!clientId || !clientSecret || !tokenEndpoint) {
      console.warn(chalk.red("❌ Missing environment variables:"));
      if (!clientId) console.error(chalk.red("  • ENODE_CLIENT_ID is missing"));
      if (!clientSecret)
        console.warn(chalk.red("  • ENODE_CLIENT_SECRET is missing"));
      if (!tokenEndpoint)
        console.warn(chalk.red("  • ENODE_OAUTH_URL is missing"));
      throw new Error(
        "Client ID, Client Secret, or Token Endpoint is not defined"
      );
    }

    // Validate variable types
    console.log(chalk.blue("🔍 Validating credential types..."));
    if (
      typeof clientId !== "string" ||
      typeof clientSecret !== "string" ||
      typeof tokenEndpoint !== "string"
    ) {
      console.warn(chalk.red("❌ Invalid credential types:"));
      if (typeof clientId !== "string")
        console.warn(chalk.red("  • ENODE_CLIENT_ID is not a string"));
      if (typeof clientSecret !== "string")
        console.warn(chalk.red("  • ENODE_CLIENT_SECRET is not a string"));
      if (typeof tokenEndpoint !== "string")
        console.warn(chalk.red("  • ENODE_OAUTH_URL is not a string"));
      throw new Error("Invalid Client ID, Client Secret, or Token Endpoint");
    }

    console.log(chalk.blue("📡 Making OAuth request..."));
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
      console.warn(
        chalk.red(`❌ OAuth request failed with status: ${response.status}`)
      );
      throw new Error(`Failed to fetch access token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(chalk.cyan("📥 Received OAuth response:"), data);

    if (!data.access_token) {
      console.warn(chalk.red("❌ No access token in response"));
      throw new Error("Access token missing in response");
    }

    console.log(chalk.green("✅ Access token generated successfully"));
    return data.access_token;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error generating access token:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw new Error(
      `Failed to generate access token: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const isTokenExpired = async (createdAt: Date) => {
  console.log(chalk.blue("⏳ Checking token expiration..."));

  try {
    const now = new Date();
    console.log(chalk.cyan("🕒 Current time:", now.toISOString()));

    const oneHoursAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hours ago
    console.log(
      chalk.cyan("🕐 Expiration threshold:", oneHoursAgo.toISOString())
    );

    console.log(chalk.cyan("📅 Token creation time:", createdAt.toISOString()));

    const isExpired = createdAt < oneHoursAgo;
    console.log(
      isExpired
        ? chalk.yellow("⚠️ Token is expired")
        : chalk.green("✅ Token is still valid")
    );

    return isExpired;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error checking token expiration:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    // In case of error, assume token is expired for safety
    return true;
  }
};

export const createLinkSession = async (userId: number) => {
  console.log(chalk.blue("🔗 Initiating link session creation..."));

  try {
    // Get the access token
    console.log(chalk.blue("🔑 Fetching access token..."));
    const accessToken = await getEnodeAccessToken();

    // Check if access token is missing
    if (!accessToken) {
      console.warn(chalk.red("❌ Access token is missing"));
      throw new Error("Access token missing");
    }
    console.log(chalk.green("✅ Access token retrieved successfully"));

    // Prepare the request body
    console.log(chalk.blue("📝 Preparing request payload..."));
    const requestBody = {
      vendorType: "vehicle",
      scopes: [
        "vehicle:read:data",
        "vehicle:read:location",
        "vehicle:control:charging",
      ],
      language: "en-US",
      redirectUri: `${process.env.ENODE_VEHICLE_ADD_REDIRECT}`,
    };

    if (!process.env.ENODE_VEHICLE_ADD_REDIRECT) {
      console.warn(
        chalk.red("❌ Missing ENODE_VEHICLE_ADD_REDIRECT environment variable")
      );
      throw new Error("Missing redirect URI configuration");
    }

    // Make the API call to create the Link session
    console.log(chalk.blue("📡 Making API request to create link session..."));
    console.log(chalk.cyan(`👤 Creating link session for user ID: ${userId}`));

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

    if (!response.ok) {
      console.warn(
        chalk.red(
          `❌ Failed to create link session - Status: ${response.status}`
        )
      );
      console.warn(chalk.red(`📝 Response: ${await response.text()}`));
      throw new Error(`Failed to create Link session: ${response.statusText}`);
    }

    // Extract linkUrl from the response
    const responseData = await response.json();

    if (!responseData.linkUrl) {
      console.warn(chalk.red("❌ No linkUrl in response"));
      throw new Error("Link URL missing in response");
    }

    console.log(chalk.green("✅ Link session created successfully"));
    console.log(chalk.cyan("🔗 Link URL generated:", responseData.linkUrl));

    return responseData.linkUrl;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error creating link session:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw new Error(
      `Failed to create Link session: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const listWebhook = async () => {
  console.log(chalk.magenta.bold("🚀 Starting listWebhook function..."));
  console.log(chalk.yellow("🪝 Initiating webhook list retrieval..."));

  try {
    console.log(chalk.cyan("🔑 Attempting to fetch access token..."));
    const accessToken = await getEnodeAccessToken();
    console.log(
      chalk.yellow("🔍 Access Token Status:"),
      accessToken ? "✅ Received" : "❌ Not Received"
    );

    if (!accessToken) {
      console.warn(chalk.redBright("❌ Access token is missing"));
      console.warn(
        chalk.red("📝 Debug: getEnodeAccessToken returned:", accessToken)
      );
      throw new Error("Access token is required to list webhooks");
    }
    console.log(chalk.greenBright("✅ Access token successfully retrieved"));

    if (!process.env.ENODE_API_URL) {
      console.warn(
        chalk.redBright("❌ Missing ENODE_API_URL environment variable")
      );
      console.warn(
        chalk.red("📝 Available env vars:", Object.keys(process.env))
      );
      throw new Error("ENODE_API_URL environment variable is not configured");
    }
    console.log(
      chalk.cyan("🌐 ENODE_API_URL configured:", process.env.ENODE_API_URL)
    );
    console.log(
      chalk.cyan("🌐 final url:", `${process.env.ENODE_API_URL}` + `/webhooks`)
    );

    console.log(chalk.blue("📡 Making API request to fetch webhooks..."));
    const response = await fetch(`${process.env.ENODE_API_URL}/webhooks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Enode-Version": "2024-01-01",
      },
    });

    console.log(chalk.cyan("📥 Response Status:"), response.status);
    console.log(
      chalk.cyan("📥 Response Headers:"),
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        chalk.redBright(
          `❌ Failed to fetch webhooks - Status: ${response.status}`
        )
      );
      console.warn(chalk.red(`📝 Response: ${errorText}`));
      throw new Error(`Failed to fetch webhooks: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(chalk.cyan("📥 Received webhooks data:"), responseData);

    if (!responseData.data) {
      console.log(chalk.yellow("⚠️ No webhook data in response"));
      return { data: [] };
    }

    return responseData;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error listing webhooks:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw new Error(
      `Failed to list webhooks: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const runWebhook = async () => {
  console.log(chalk.blue("🪝 Initiating webhook setup process..."));

  try {
    console.log(chalk.blue("📋 Fetching current webhook list..."));
    const webhookList = await listWebhook();
    console.log(chalk.cyan("📥 Webhook list retrieved:", webhookList));

    const expectedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/en/api/enode`;

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn(
        chalk.red("❌ Missing NEXT_PUBLIC_BASE_URL environment variable")
      );
      throw new Error(
        "NEXT_PUBLIC_BASE_URL environment variable is not configured"
      );
    }

    // Check webhook conditions
    if (webhookList.data.length === 1) {
      const webhook = webhookList.data[0];
      console.log(chalk.blue("🔍 Analyzing existing webhook..."));

      if (webhook.isActive && webhook.url === expectedUrl) {
        console.log(chalk.green("✅ Existing webhook is valid and active"));
        return webhookList;
      } else if (webhook.url !== expectedUrl) {
        console.log(chalk.yellow("⚠️ Webhook URL mismatch, updating..."));
        await updateWebhook(webhook.id);
      } else if (!webhook.isActive) {
        console.log(chalk.yellow("⚠️ Webhook is inactive, recreating..."));
        const responseData = await deleteAndRerunWebHook(webhook.id);
        console.log(chalk.green("✅ Webhook recreated successfully"));
        return responseData;
      }
    } else if (webhookList.data.length === 0) {
      console.log(
        chalk.yellow("⚠️ No webhooks found, creating new webhook...")
      );
      const responseData = await createWebHook();
      console.log(chalk.green("✅ New webhook created successfully"));
      return responseData;
    } else {
      console.log(
        chalk.yellow("⚠️ Multiple webhooks found, this is unexpected")
      );
    }

    return webhookList;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error in webhook setup:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    if (process.env.ENODE_WEBHOOK_SECRET) {
      console.log(chalk.yellow("ℹ️ Webhook secret is configured"));
    } else {
      console.warn(chalk.red("❌ ENODE_WEBHOOK_SECRET is not configured"));
    }
    throw new Error(
      `Webhook setup failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const createWebHook = async () => {
  console.log(chalk.blue("🪝 Initiating webhook creation..."));

  try {
    console.log(chalk.blue("🔑 Fetching access token..."));
    const accessToken = await getEnodeAccessToken();

    if (!accessToken) {
      console.warn(chalk.red("❌ Access token is missing"));
      throw new Error("Access token required for webhook creation");
    }

    // Validate environment variables
    console.log(chalk.blue("🔍 Validating environment variables..."));
    if (!process.env.ENODE_WEBHOOK_SECRET) {
      console.warn(chalk.red("❌ Missing ENODE_WEBHOOK_SECRET"));
      throw new Error("Webhook secret is not configured");
    }
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn(chalk.red("❌ Missing NEXT_PUBLIC_BASE_URL"));
      throw new Error("Next public URL is not configured");
    }
    if (!process.env.ENODE_API_URL) {
      console.warn(chalk.red("❌ Missing ENODE_API_URL"));
      throw new Error("Enode API URL is not configured");
    }

    const webhookUrl = `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/en/api/enode`;
    console.log(chalk.yellow("🔗 Generated webhook URL:"), webhookUrl);
    // console.log(chalk.magenta(`${process.env.NEXT_PUBLIC_BASE_URL}/en/api/enode`));
    console.log(chalk.blue("📝 Preparing webhook configuration..."));
    const data = {
      secret: process.env.ENODE_WEBHOOK_SECRET,
      url: webhookUrl,
      // url: `${process.env.NEXT_PUBLIC_BASE_URL}/en/api/enode`,
      apiVersion: "2024-01-01",
      events: ["*"],
    };
    console.log(chalk.cyan("📋 Webhook configuration prepared"));

    console.log(chalk.blue("📡 Making API request to create webhook..."));
    const response = await fetch(`${process.env.ENODE_API_URL}/webhooks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.warn(
        chalk.red(`❌ Failed to create webhook - Status: ${response.status}`)
      );
      console.warn(chalk.red(`📝 Response: ${await response.text()}`));
      throw new Error(`Failed to create webhook: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(chalk.green("✅ Webhook created successfully"));
    console.log(chalk.cyan("📥 Webhook details:", responseData));

    return responseData;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error creating webhook:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw new Error(
      `Failed to create webhook: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const deleteAndRerunWebHook = async (id: string) => {
  console.log(chalk.blue("🔄 Initiating webhook recreation process..."));

  try {
    console.log(chalk.yellow(`🗑️ Deleting webhook with ID: ${id}`));
    await deleteWebhook(id);
    console.log(chalk.green("✅ Webhook deleted successfully"));

    console.log(chalk.blue("🪝 Rerunning webhook setup..."));
    const newWebhook = await runWebhook();
    console.log(chalk.green("✅ Webhook recreation completed successfully"));

    return newWebhook;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error in deleting webhook and rerunning:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    console.warn(chalk.red("🔍 Failed webhook ID:"), id);
    throw new Error(
      `Failed to delete webhook and rerun: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const updateWebhook = async (id: string) => {
  console.log(chalk.blue("🔄 Initiating webhook update..."));

  try {
    console.log(chalk.blue("🔑 Fetching access token..."));
    const accessToken = await getEnodeAccessToken();

    if (!accessToken) {
      console.warn(chalk.red("❌ Access token is missing"));
      throw new Error("Access token required for webhook update");
    }

    // Validate environment variables
    console.log(chalk.blue("🔍 Validating environment variables..."));
    if (!process.env.ENODE_WEBHOOK_SECRET) {
      console.warn(chalk.red("❌ Missing ENODE_WEBHOOK_SECRET"));
      throw new Error("Webhook secret is not configured");
    }
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn(chalk.red("❌ Missing NEXT_PUBLIC_BASE_URL"));
      throw new Error("Next public URL is not configured");
    }
    if (!process.env.ENODE_API_URL) {
      console.warn(chalk.red("❌ Missing ENODE_API_URL"));
      throw new Error("Enode API URL is not configured");
    }

    console.log(chalk.blue("📝 Preparing webhook update configuration..."));

    if (!process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
      console.warn(chalk.redBright("❌ Missing NEXT_PUBLIC_ROOT_DOMAIN"));
      throw new Error("Root domain is not configured");
    }

    const webhookUrl = `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/en/api/enode`;
    console.log(chalk.yellow("🔗 Generated webhook URL:"), webhookUrl);

    const data = {
      secret: process.env.ENODE_WEBHOOK_SECRET,
      url: webhookUrl,
      apiVersion: "2024-01-01",
      events: ["*"],
    };

    console.log(chalk.cyan("📋 Update configuration prepared"));
    console.log(chalk.yellow("🔗 Webhook URL:"), data.url);

    console.log(chalk.blue(`📡 Making API request to update webhook ${id}...`));

    console.log(
      chalk.cyan(
        "🌐 final url:",
        `${process.env.ENODE_API_URL}` + `/webhooks/${id}`
      )
    );
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

    if (!response.ok) {
      console.warn(
        chalk.red(`❌ Failed to update webhook - Status: ${response.status}`)
      );
      console.warn(chalk.red(`📝 Response: ${await response.text()}`));
      throw new Error(`Failed to update webhook: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(chalk.green("✅ Webhook updated successfully"));
    console.log(chalk.cyan("📥 Updated webhook details:", responseData));
    console.log(
      chalk.cyan(
        "🔐 Webhook secret configured:",
        !!process.env.ENODE_WEBHOOK_SECRET
      )
    );
    console.log(chalk.cyan("🔍 Updated webhook ID:", id));

    return responseData;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error updating webhook:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    console.warn(chalk.red("🔍 Failed webhook ID:"), id);
    throw new Error(
      `Failed to update webhook: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const deleteWebhook = async (id: string) => {
  console.log(chalk.blue("🗑️ Initiating webhook deletion..."));

  try {
    console.log(chalk.blue("🔑 Fetching access token..."));
    const accessToken = await getEnodeAccessToken();

    if (!accessToken) {
      console.warn(chalk.red("❌ Access token is missing"));
      throw new Error("Access token required for webhook deletion");
    }

    if (!process.env.ENODE_API_URL) {
      console.warn(chalk.red("❌ Missing ENODE_API_URL environment variable"));
      throw new Error("ENODE_API_URL is not configured");
    }

    console.log(chalk.yellow(`⚠️ Preparing to delete webhook with ID: ${id}`));
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
      console.warn(
        chalk.red(`❌ Failed to delete webhook - Status: ${response.status}`)
      );
      console.warn(chalk.red(`📝 Response: ${await response.text()}`));
      throw new Error(`Failed to delete webhook: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(chalk.green("✅ Webhook deleted successfully"));
    console.log(
      chalk.cyan("📤 Deletion response:", JSON.stringify(responseData))
    );
    console.log(chalk.cyan(`🔍 Deleted webhook ID: ${id}`));

    return responseData;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error deleting webhook:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    console.warn(chalk.red("🔍 Failed webhook ID:"), id);
    throw new Error(
      `Failed to delete webhook: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const handleWebhook = async (req: Request) => {
  console.log(chalk.blue("🪝 Initiating webhook handler..."));

  try {
    // Read headers from the request
    const signature = req.headers.get("x-enode-signature") as
      | string
      | undefined;

    if (!signature) {
      console.warn(chalk.red("❌ Missing x-enode-signature header"));
      throw new Error("Missing webhook signature");
    }
    console.log(chalk.cyan("🔐 Received signature:", signature));

    // Parse request body
    console.log(chalk.blue("📦 Parsing request body..."));
    const body = await new Response(req.body).json();
    console.log(
      chalk.cyan("📥 Webhook payload:", JSON.stringify(body, null, 2))
    );

    // Validate webhook secret
    if (!process.env.ENODE_WEBHOOK_SECRET) {
      console.warn(
        chalk.red("❌ Missing ENODE_WEBHOOK_SECRET environment variable")
      );
      throw new Error("Webhook secret is not configured");
    }
    console.log(
      chalk.cyan(
        "🔑 Webhook secret configured:",
        !!process.env.ENODE_WEBHOOK_SECRET
      )
    );

    // Verify signature
    console.log(chalk.blue("🔍 Verifying webhook signature..."));
    const isValidSignature = await verifySignature(
      body,
      signature,
      process.env.ENODE_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      console.warn(chalk.red("❌ Invalid webhook signature"));
      throw new Error("Invalid signature");
    }
    console.log(chalk.green("✅ Signature verified successfully"));

    // Process webhook events
    console.log(chalk.blue("⚡ Processing webhook events..."));
    const events = body;

    if (!Array.isArray(events)) {
      console.warn(chalk.red("❌ Invalid event format - expected array"));
      throw new Error("Invalid event format");
    }

    console.log(chalk.cyan(`📊 Processing ${events.length} events...`));
    for (const event of events) {
      console.log(chalk.blue(`🔄 Processing event type: ${event.event}`));
      await handleEvent(event);
    }

    console.log(chalk.green("✅ Webhook handled successfully"));
  } catch (error) {
    console.warn(
      chalk.red("❌ Error handling webhook:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw new Error(
      `Webhook handling failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Function to verify the signature
async function verifySignature(
  payload: any,
  signature: string | undefined,
  secret: string
) {
  console.log(chalk.blue("🔐 Initiating signature verification..."));

  try {
    if (!signature) {
      console.warn(chalk.red("❌ No signature provided"));
      return false;
    }
    console.log(chalk.cyan("📥 Received signature:", signature));

    if (!secret) {
      console.warn(chalk.red("❌ No secret provided for verification"));
      return false;
    }
    console.log(chalk.cyan("🔑 Secret available for verification"));

    console.log(chalk.blue("🔄 Creating HMAC..."));
    const hmac = crypto.createHmac("sha1", secret);

    console.log(chalk.blue("📝 Generating digest..."));
    const digest = Buffer.from(
      "sha1=" + hmac.update(JSON.stringify(payload)).digest("hex"),
      "utf8"
    );

    console.log(chalk.blue("🔍 Converting received signature..."));
    const receivedSignature = Buffer.from(signature, "utf8");

    console.log(chalk.blue("⚡ Performing timing-safe comparison..."));
    const isValid = crypto.timingSafeEqual(
      new Uint8Array(digest),
      new Uint8Array(receivedSignature)
    );

    console.log(
      isValid
        ? chalk.green("✅ Signature verified successfully")
        : chalk.yellow("⚠️ Signature verification failed")
    );

    return isValid;
  } catch (error) {
    console.warn(
      chalk.red("❌ Error verifying signature:"),
      chalk.red(error instanceof Error ? error.message : "Unknown error")
    );
    console.warn(
      chalk.red("📋 Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace"
    );
    return false;
  }
}

// Function to handle each event
export const handleEvent = async (event: any) => {
  try {
    const authobject = auth();
    console.log(chalk.magenta("👤 Auth object retrieved:", authobject));

    console.log(chalk.yellow("📥 Processing event:"));
    console.log(chalk.magenta("📋 Event type:", event.event));
    console.log(chalk.yellow("🔍 Event details:"));
    console.log(event);

    switch (event.event) {
      case "user:vehicle:discovered": {
        console.log(chalk.blue("🚗 Processing vehicle discovery..."));
        const vehicleData = event.vehicle;
        console.log(chalk.cyan("📊 Vehicle data:", vehicleData));
        await prisma.vehicle.create({
          data: {
            id: vehicleData.id,
            vin: vehicleData.information.vin,
            vehicleId: vehicleData.id, // Assuming vehicleId is the same as id
            model: vehicleData.information.model,
            year: vehicleData.information.year,
            batteryCapacity: 70, // Set as needed - keep vehicleData.chargeState.batteryCapacity if not needed
            ownerID: Number(vehicleData.userId),
            soc: 90, // Set as needed - keep vehicleData.chargeState.batteryLevel if not needed
            dateOfConnection: new Date(), // Set to the current date
            odometerFloat: 4561, // Set as needed - keep vehicleData.odometer.distance if not needed
            usageAverageDailyKmDriven: [
              128, 130, 131, 125, 135, 136, 138, 150, 150, 152, 154, 157,
            ], // Populate this as  - keep [] if not needed
            monthlyUsage: [
              3189, 3241, 3287, 3113, 3364, 3390, 3461, 3750, 3755, 3794, 3855,
              3926,
            ], //keep [] if kept for new vehicle // Populate this as needed
            condition: "Good", // Set an initial condition
            status: vehicleData.isReachable ? "Active" : "Inactive",
            make: vehicleData.vendor,
            batteryHealthSoH: 96.1, // Set as needed - keep null if not needed
            batteryHealthDegradation: 3.9, // Set as needed - keep null if not needed
            location: "Bangalore,India", // `${vehicleData.location.latitude}, ${vehicleData.location.longitude}`, // Or any specific location string
            soh: [
              97.9, 96.6, 96.5, 96.5, 96.4, 96.4, 96.3, 96.2, 96.2, 96.1, 96.1,
              96.1,
            ], // Set as needed - keep [] if not needed
            batteryHealthAverageEstimatedDegradation: [
              2.1, 3.4, 3.8, 4, 3.9, 3.8, 3.7, 3.5, 3.5, 3.3, 3.3, 3.3,
            ], // Set as needed - keep [] if not needed
            batteryHealthAverageSoC: 66.51, // Set as needed - keep null if not needed
            batteryHealthTotalBatteries: 860, // Set as needed - keep null if not needed
            connectorType: "Rapid", // Set as needed - keep null if not needed
            endOfLife: "5+Years", // Set as needed - keep null if not needed
            realRangeObserved: vehicleData.chargeState.range,
            remainingUsefulLife: "5+Years", // Set as needed - keep null if not needed
            totalChargingSession: 81, // Initial count
            totalEnergyConsumed: "2106kWh", // Set as needed - keep null if not needed
            vehicleConditionCritical: 1, // Initial count 1 for false and 0 for true
            vehicleConditionGood: 4, // Initial count
            vehicleConditionSatisfactory: 5, // Initial count
            vehicleStatusActive: vehicleData.isReachable ? 1 : 0,
            vehicleStatusCharging: vehicleData.chargeState.isCharging ? 1 : 0,
            vehicleStatusInUse: 7, // Set as needed
            vehicleStatusOutOfService: 1, // Set as needed - keep 0 if not needed
            epawltpProvidedRange: 210, // Set as needed - keep 210 if not needed
            usageRangeObservedMax: 196, // Set as needed - keep null if not needed
            usageRangeObservedMin: 156, // Set as needed - keep null if not needed
            usageSoCRangeMax: 100, // Set as needed - keep null if not needed
            usageSoCRangeMin: 15, // Set as needed - keep null if not needed
            usageTemperatureHigh: 37, // Set as needed - keep null if not needed
            usageTemperatureLow: 24, // Set as needed - keep null if not needed
            batteryChemistry: "Lithium-ion", // Set as needed - keep "Lithium-ion" if not needed
            batteryHealthAverageSoH: 96.44166667, // Set as needed - keep null if not needed
            dataPointsCollected: 1312, // Initial count - keep 0 if not needed
            averageMonthlyUsage: 3510.4, // Set as needed - keep null if not needed
            owner: {
              connect: { id: Number(1) },
            },
          },
        });

        console.log(chalk.green("✅ Vehicle created successfully"));
        // const setVehicles = useVehicleStore((state) => state.setVehicles);
        // const userVehiclesFromDB = await getUserVehicles();
        // setVehicles(userVehiclesFromDB);
        break;
      }

      case "user:vehicle:updated": {
        console.log(chalk.blue("🔄 Processing vehicle update..."));
        const updatedVehicle = event.vehicle;

        const existingVehicle = await prisma.vehicle.findUnique({
          where: { id: updatedVehicle.id },
        });

        if (!existingVehicle) {
          console.warn(
            chalk.red(`❌ Vehicle not found in database: ${updatedVehicle.id}`)
          );
          return;
        }

        console.log(chalk.blue("📝 Checking for vehicle updates..."));
        const updatedFields: any = {};

        if (
          updatedVehicle.odometer?.distance !== existingVehicle.odometerFloat
        ) {
          console.log(chalk.cyan("🔄 Updating odometer reading"));
          updatedFields.odometerFloat = updatedVehicle.odometer.distance;
        }
        if (
          updatedVehicle.chargeState?.batteryCapacity !==
          existingVehicle.batteryCapacity
        ) {
          console.log(chalk.cyan("🔋 Updating battery capacity"));
          updatedFields.batteryCapacity =
            updatedVehicle.chargeState.batteryCapacity;
        }
        if (updatedVehicle.chargeState?.batteryLevel !== existingVehicle.soc) {
          console.log(chalk.cyan("⚡ Updating battery level"));
          updatedFields.soc = updatedVehicle.chargeState.batteryLevel;
        }

        if (Object.keys(updatedFields).length > 0) {
          console.log(chalk.blue("📤 Applying updates to database..."));
          updatedFields.updatedAt = new Date();

          const updatedVehicleData = await prisma.vehicle.update({
            where: { id: updatedVehicle.id },
            data: updatedFields,
          });

          console.log(
            chalk.green("✅ Vehicle information updated successfully")
          );
          console.log(chalk.cyan("📋 Updated fields:", updatedFields));
        } else {
          console.log(
            chalk.yellow(
              "ℹ️ No changes detected for vehicle:",
              updatedVehicle.id
            )
          );
        }
        break;
      }

      // Delete vehicle from single table
      case "user:vehicle:deleted": {
        console.log(chalk.blue("🗑️ Processing vehicle deletion..."));
        const vehicle = event.vehicle;

        const deletedVehicle = await prisma.vehicle.delete({
          where: { id: vehicle.id },
        });

        console.log(chalk.green("✅ Vehicle deleted successfully"));
        console.log(chalk.cyan("🔍 Deleted vehicle ID:", vehicle.id));
        break;
      }

      case "user:charger:discovered": {
        console.log(chalk.blue("⚡ Processing charger discovery..."));
        const charger = event.charger;
        console.log(chalk.cyan("📊 Charger data:", charger));

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

        console.log(chalk.green("✅ Charger created successfully"));
        break;
      }

      case "user:charger:deleted": {
        console.log(chalk.blue("🗑️ Processing charger deletion..."));
        const charger = event.charger;

        const deletedCharger = await prisma.chargerMaster.delete({
          where: { chargerID: charger.id },
        });

        console.log(chalk.green("✅ Charger deleted successfully"));
        console.log(chalk.cyan("🔍 Deleted charger ID:", charger.id));
        break;
      }

      default:
        console.log("Skipping event:", event.event);
        break;
    }
  } catch (error) {
    console.warn("Error handling events:", error);
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
//         console.warn("Vehicle not found in the database:", updatedVehicle.id);
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
//     console.warn("Error handling events:", error);
//   }
// };
