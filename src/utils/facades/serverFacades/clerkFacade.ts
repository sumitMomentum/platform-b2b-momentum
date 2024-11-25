import { WebhookEvent, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import prisma from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import {
  getUser,
  handleUserCreated,
  handleUserDeleted,
  handleUserUpdated,
} from "./userFacade";
import chalk, { blue, cyan, green, magenta, red, yellow } from "chalk";
import { log } from "console";
import { verify } from "crypto";
import { get } from "http";
import { text } from "stream/consumers";
import { deleteUser } from "@/actions/superAdmin/superAdminUsersModule/delete-user";
import { users } from "@/seed/seeds/users";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

export async function validateClerkRequest(request: Request) {
  console.log(chalk.blue("🔐 Starting Clerk request validation"));

  const payloadString = await request.text();
  console.log(chalk.cyan("📦 Received payload"));

  const headerPayload = await headers();
  console.log(chalk.cyan("📨 Retrieved headers"));

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  console.log(chalk.yellow("🏷️ SVIX headers assembled:"), {
    hasId: !!svixHeaders["svix-id"],
    hasTimestamp: !!svixHeaders["svix-timestamp"],
    hasSignature: !!svixHeaders["svix-signature"],
  });

  const wh = new Webhook(webhookSecret);
  console.log(
    chalk.magenta("🔑 Webhook secret:"),
    webhookSecret ? "(present)" : "(missing)"
  );

  try {
    const verified = wh.verify(payloadString, svixHeaders) as WebhookEvent;
    console.log(chalk.green("✅ Request verified successfully"));
    return verified;
  } catch (error) {
    console.log(chalk.red("❌ Request verification failed:"), error);
    throw error;
  }
}

export const handleEventWebhook = async (evt: WebhookEvent) => {
  console.log(chalk.blue("🎮 Handling webhook event:"), evt.type);

  switch (evt.type) {
    case "user.created":
      console.log(chalk.green("👤 Processing user creation webhook"));
      await handleUserCreated(evt.data, "webhook");
      console.log(chalk.green("✅ User creation handled successfully"));
      break;

    case "user.updated":
      console.log(chalk.yellow("📝 Processing user update webhook"));
      await handleUserUpdated(evt.data, "webhook");
      console.log(chalk.yellow("✅ User update handled successfully"));
      break;

    case "user.deleted":
      console.log(chalk.red("🗑️ Processing user deletion webhook"));
      await handleUserDeleted(evt.data);
      console.log(chalk.red("✅ User deletion handled successfully"));
      break;

    case "organization.created":
      console.log(chalk.magenta("🏢 Processing organization creation webhook"));
      await handleUserCreated(evt.data, "webhook");
      console.log(
        chalk.magenta("✅ Organization creation handled successfully")
      );
      break;

    case "organization.updated":
      console.log(chalk.cyan("📋 Processing organization update webhook"));
      await handleUserUpdated(evt.data, "webhook");
      console.log(chalk.cyan("✅ Organization update handled successfully"));
      break;

    default:
      console.log(chalk.gray("⚠️ Unhandled webhook event type:"), evt.type);
  }

  console.log(chalk.blue("🏁 Webhook processing completed"));
};

const getUserClerkId = async (userId: number) => {
  console.log(chalk.blue("🔍 Looking up Clerk ID for user:"), userId);

  const result = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      externalId: true,
    },
  });

  if (result) {
    console.log(chalk.green("✅ Found Clerk ID:"), result.externalId);
  } else {
    console.log(chalk.yellow("⚠️ No Clerk ID found for user"));
  }

  return result;
};

export const getOrganizationMembers = async (organizationId: string) => {
  console.log(
    chalk.blue("👥 Fetching members for organization:"),
    organizationId
  );

  try {
    const members = await (
      await clerkClient()
    ).organizations.getOrganizationMembershipList({
      organizationId,
    });

    console.log(
      chalk.green("✅ Successfully retrieved"),
      members.data.length,
      "members"
    );
    return members;
  } catch (error) {
    console.log(chalk.red("❌ Error fetching organization members:"), error);
    throw error;
  }
};

export const handleUpdateDataForUser = async ({
  scope,
  userBdId,
  data,
}: {
  scope: "publicMetadata" | "privateMetadata" | "unsafeMetadata";
  userBdId: number;
  data: any;
}) => {
  console.log(chalk.blue("🔄 Starting metadata update:"), { scope, userBdId });

  const user = await getUserClerkId(userBdId);
  console.log(chalk.cyan("🔍 User lookup result:"), !!user);

  let userId: string | null = null;
  let userType: "user" | "organization" = "organization";

  if (user) {
    userId = user.externalId;
    console.log(chalk.cyan("📌 Found external ID:"), userId);

    if (userId.startsWith("user_")) {
      userType = "user";
      console.log(chalk.yellow("👤 Identified as user type"));
    } else {
      console.log(chalk.yellow("🏢 Identified as organization type"));
    }
  }

  if (!userId) {
    console.log(chalk.red("❌ User ID not found"));
    throw new Error("User not found");
  }

  try {
    if (scope === "publicMetadata") {
      console.log(chalk.magenta("📢 Updating public metadata"));
      if (userType === "user") {
        await (
          await clerkClient()
        ).users.updateUserMetadata(userId, {
          publicMetadata: data,
        });
        console.log(chalk.green("✅ Updated user public metadata"));
      } else {
        await (
          await clerkClient()
        ).organizations.updateOrganizationMetadata(userId, {
          publicMetadata: data,
        });
        console.log(chalk.green("✅ Updated organization public metadata"));
      }
    }

    if (scope === "privateMetadata") {
      console.log(chalk.magenta("🔒 Updating private metadata"));
      if (userType === "user") {
        await (
          await clerkClient()
        ).users.updateUserMetadata(userId, {
          privateMetadata: data,
        });
        console.log(chalk.green("✅ Updated user private metadata"));
      } else {
        await (
          await clerkClient()
        ).organizations.updateOrganizationMetadata(userId, {
          privateMetadata: data,
        });
        console.log(chalk.green("✅ Updated organization private metadata"));
      }
    }

    if (scope === "unsafeMetadata") {
      console.log(chalk.magenta("⚠️ Updating unsafe metadata"));
      await (
        await clerkClient()
      ).users.updateUserMetadata(userId, {
        unsafeMetadata: data,
      });
      console.log(chalk.green("✅ Updated unsafe metadata"));
    }

    console.log(chalk.green("🎉 Metadata update completed successfully"));
  } catch (error) {
    console.log(chalk.red("❌ Error updating metadata:"), error);
    throw error;
  }
};

export const getUserOrganizations = async (userId: number) => {
  console.log(chalk.blue("🏢 Getting organizations for user:"), userId);

  const userClerkId = await getUserClerkId(userId);
  if (!userClerkId) {
    console.log(chalk.red("❌ User clerk ID not found"));
    throw new Error("User clerk not found");
  }
  console.log(chalk.green("✅ Found user clerk ID"));
};

export const getClerkUserByExternalId = async (externalId: string) => {
  console.log(
    chalk.blue("🔍 Looking up Clerk user by external ID:"),
    externalId
  );
  try {
    const user = await (await clerkClient()).users.getUser(externalId);
    console.log(chalk.green("✅ Clerk user found"));
    return user;
  } catch (error) {
    console.log(chalk.red("❌ Error fetching Clerk user:"), error);
    throw error;
  }
};

export const getUserInBdByExternalId = async (externalId: string) => {
  console.log(
    chalk.blue("🔍 Looking up user in database by external ID:"),
    externalId
  );
  const user = await prisma.user.findFirst({
    where: { externalId },
  });
  console.log(chalk.cyan("👤 Database user lookup result:"), !!user);
  return user;
};

export const getUserInClerk = async () => {
  console.log(chalk.blue("🔐 Getting current Clerk user"));

  const userClerk = await currentUser();
  if (!userClerk) {
    console.log(chalk.red("❌ Current user not found in Clerk"));
    throw new Error("User not found");
  }

  console.log(chalk.green("✅ Found current user in Clerk"));
  return await getUserInBdByExternalId(userClerk.id);
};

export const deleteClerkUser = async (userId: string) => {
  console.log(chalk.yellow("🗑️ Deleting user from Clerk:"), userId);
  try {
    await (await clerkClient()).users.deleteUser(userId);
    console.log(chalk.green("✅ User successfully deleted from Clerk"));
  } catch (error) {
    console.log(chalk.red("❌ Error deleting user from Clerk:"), error);
    throw error;
  }
};

export const createClerkUser = async (payload: any) => {
  console.log(chalk.blue("👤 Creating new Clerk user with payload:"), payload);
  try {
    const user = await (await clerkClient()).users.createUser(payload);
    console.log(chalk.green("✅ Clerk user created successfully"));
    return user;
  } catch (error) {
    console.log(chalk.red("❌ Error creating Clerk user:"), error);
    throw error;
  }
};

export const createClerkOrganization = async (payload: any) => {
  console.log(
    chalk.blue("🏢 Creating new Clerk organization with payload:"),
    payload
  );
  try {
    const org = await (
      await clerkClient()
    ).organizations.createOrganization(payload);
    console.log(chalk.green("✅ Clerk organization created successfully"));
    return org;
  } catch (error) {
    console.log(chalk.red("❌ Error creating Clerk organization:"), error);
    throw error;
  }
};
