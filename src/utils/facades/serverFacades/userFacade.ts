import { User } from "@prisma/client";
import chalk, { blue, cyan, green, magenta, red, yellow } from "chalk";
import { checkMarketingActionsOnRegister } from "./marketingFacade";
import { syncUserPermissions } from "./scurityFacade";
import prisma from "@/lib/db";
import {
  getClerkUserByExternalId,
  handleUpdateDataForUser,
} from "./clerkFacade";
import { createAmountByDefaultForUser } from "@/actions/admin/walletModule/create-amount-movement";
///import { getUserCapabilitiesNames } from "./membershipFacade";
import { notifyToSuperAdmin } from "./notificationFacade";
import { getUserCapabilitiesNames } from "./membershipFacade";
import { redirect } from "next/navigation";
import { log } from "console";
import { map } from "svix/dist/openapi/rxjsStub";

export async function createDefaultSettingForuser(user: User) {
  console.log(chalk.blue("⚙️ Creating default settings for user:"), user.id);
  try {
    await prisma.userSetting.create({
      data: {
        userId: user.id,
        settingName: "newPlatformNotification",
        settingValue: "1",
      },
    });
    console.log(chalk.green("✅ Default settings created successfully"));
  } catch (error) {
    console.log(chalk.red("❌ Error creating default settings:"), error);
    throw error;
  }
}

export const getUser = async (userAuthData: any) => {
  console.log(chalk.blue("🔍 Starting user lookup with auth data:"), {
    orgId: userAuthData.orgId,
    userId: userAuthData.userId,
  });

  const include = {
    permissions: true,
    Membership: {
      include: {
        plan: {
          include: {
            PlanCapabilities: {
              include: {
                capabilitie: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  console.log(chalk.cyan("📋 Query include structure prepared"));

  let user = await prisma.user.findFirst({
    where: {
      externalId: userAuthData.orgId || userAuthData.userId,
    },
    include,
  });
  console.log(chalk.yellow("🔎 Initial user lookup result:"), !!user);

  if (!user) {
    console.log(chalk.yellow("⚠️ User not found, starting retry process"));
    user = await prisma.user.findFirst({
      where: {
        externalId: userAuthData.orgId || userAuthData.userId,
      },
      include,
    });

    const maxRetryAttempts = 5;
    const retryDelay = 500;
    console.log(chalk.cyan("⏱️ Retry configuration:"), {
      maxRetryAttempts,
      retryDelay,
    });

    let retryCount = 0;
    while (!user && retryCount < maxRetryAttempts) {
      console.log(
        chalk.yellow(
          `🔄 Retry attempt ${retryCount + 1} of ${maxRetryAttempts}`
        )
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      user = await prisma.user.findFirst({
        where: {
          externalId: userAuthData.userId,
        },
        include,
      });
      retryCount++;
    }

    if (!user) {
      console.log(chalk.red("❌ User not found after all retry attempts"));
      redirect("/user-not-found");
    }
  }

  console.log(chalk.magenta("🔐 Extracting permissions"));
  const permissions = user.permissions.map(
    (permission: any) => permission.name
  );
  console.log(chalk.cyan("📜 Found permissions:"), permissions);

  let capabilities = [];
  console.log(chalk.magenta("⚡ Processing capabilities"));

  if (user.Membership.length > 0) {
    capabilities = user.Membership[0].plan.PlanCapabilities.map(
      (planCapability: any) => planCapability.capabilitie.name
    );
    console.log(chalk.cyan("🎯 Found capabilities:"), capabilities);
  } else {
    console.log(chalk.yellow("ℹ️ No membership found for capabilities"));
  }

  const authData = {
    userId: user.id,
    permissions,
    capabilities,
  };
  console.log(chalk.green("✅ Auth data assembled successfully"));

  return authData;
};

export const handleUserCreated = async (
  userData: any,
  source = "webhook"
): Promise<any> => {
  console.log(chalk.blue("🚀 Starting handleUserCreated"), { source });
  let newUser: any = null;

  const user = await prisma.user.findFirst({
    where: {
      externalId: userData.id,
    },
  });
  console.log(chalk.yellow("📥 Existing user check:"), !!user);

  if (!user) {
    console.log(chalk.cyan("➡️ Creating new user for source:"), source);
    if (source === "request") {
      console.log(chalk.green("📝 Creating user from request with data:"), {
        email: userData.emailAddresses?.[0]?.emailAddress,
        name: userData.fullName || userData.firstName,
      });
      newUser = await prisma.user.create({
        data: {
          externalId: userData.id,
          email: userData.emailAddresses?.[0]?.emailAddress,
          name: userData.fullName || userData.firstName,
          avatar: userData.imageUrl,
        },
      });
    } else if (source === "webhook") {
      console.log(chalk.green("📝 Creating user from webhook"));
      let payloadReferredBy: any = null;
      let payload = {
        externalId: userData.id,
        email: userData.email_addresses?.[0]?.email_address,
        name: userData.fullName || userData.first_name || userData.name,
        avatar: userData.profile_image_url || userData.image_url,
      };
      console.log(chalk.green("Initial payload:"), payload);

      const userClerkId = userData.created_by;
      if (userClerkId) {
        console.log(chalk.magenta("🔍 Found userClerkId:"), userClerkId);
        const userRoot = await prisma.user.findFirst({
          where: {
            externalId: userClerkId,
          },
        });

        if (userRoot) {
          console.log(chalk.magenta("👤 Found root user:"), userRoot.id);
          payload["email"] = userRoot.email;
          const capabilitiesNames = await getUserCapabilitiesNames(userRoot.id);
          console.log(
            chalk.magenta("🔑 User capabilities:"),
            capabilitiesNames
          );
          if (capabilitiesNames?.includes("35% cashback for affiliates")) {
            payloadReferredBy = userRoot.id;
            console.log(
              chalk.magenta("💰 Setting referral ID:"),
              payloadReferredBy
            );
          }
        }
      }

      newUser = await prisma.user
        .create({
          data: {
            ...payload,
          },
        })
        .catch((error: Error) => {
          console.log(chalk.red("❌ Error creating user:"), error);
        });

      if (newUser && payloadReferredBy) {
        console.log(chalk.green("👥 Creating referral relationship"));
        await prisma.referral.create({
          data: {
            referredId: payloadReferredBy,
            referId: newUser.id,
          },
        });
      }
    }
  }

  if (!newUser) {
    console.log(chalk.red("❌ Failed to create new user"));
    throw new Error("Error creating user");
  }

  console.log(chalk.green("✅ User created successfully"), {
    userId: newUser.id,
  });

  console.log(chalk.blue("📣 Running post-creation actions"));

  checkMarketingActionsOnRegister(newUser.id);
  console.log(chalk.blue("✓ Marketing actions checked"));

  createDefaultSettingForuser(newUser);
  console.log(chalk.blue("✓ Default settings created"));

  createAmountByDefaultForUser({
    userId: newUser.id,
  });
  console.log(chalk.blue("✓ Default amount created"));

  await handleUpdateDataForUser({
    scope: "privateMetadata",
    data: {
      userId: newUser.id,
    },
    userBdId: newUser.id,
  });
  console.log(chalk.blue("✓ User data updated"));

  notifyToSuperAdmin(
    `El usuario ${newUser.name} se ha registrado en la plataforma`
  );
  console.log(chalk.blue("✓ Admin notified"));

  console.log(chalk.green("🏁 User creation process completed"));
  return newUser;
};

export const handleUserDeleted = async (userData: any) => {
  console.log(chalk.yellow("🗑️ Processing user deletion:"), userData.id);

  const user = await prisma.user.findFirst({
    where: {
      externalId: userData.id,
    },
  });
  console.log(chalk.cyan("🔍 User lookup result:"), !!user);

  if (user) {
    console.log(chalk.yellow("⚠️ Proceeding with user deletion"));
    try {
      const result = await prisma.user.delete({
        where: {
          id: user.id,
        },
      });
      console.log(chalk.green("✅ User deleted successfully"));
      return result;
    } catch (error) {
      console.log(chalk.red("❌ Error deleting user:"), error);
      throw error;
    }
  } else {
    console.log(chalk.yellow("ℹ️ No user found to delete"));
  }
};

export const handleUserUpdated = async (userData: any, source = "webhook") => {
  console.log(chalk.blue("📝 Processing user update"), { source });

  const user = await prisma.user.findFirst({
    where: {
      externalId: userData.id,
    },
  });
  console.log(chalk.cyan("🔍 User lookup result:"), !!user);

  if (user) {
    console.log(chalk.yellow("🔄 Preparing update data"));
    let dataUpdated = {};
    if (source === "request") {
      dataUpdated = {
        externalId: userData.id,
        email: userData.emailAddresses?.[0]?.emailAddress,
        name: userData.fullName || userData.firstName,
        phone: userData.primaryPhoneNumber,
        avatar: userData.imageUrl,
      };
      console.log(chalk.cyan("📊 Request update data prepared"));
    } else {
      dataUpdated = {
        externalId: userData.id,
        email: userData.email_addresses?.[0]?.email_address,
        name: userData.fullName || userData.first_name,
        avatar: userData.profile_image_url,
      };
      console.log(chalk.cyan("📊 Webhook update data prepared"));

      console.log(chalk.magenta("🔐 Syncing user permissions"));
      syncUserPermissions(user.id, userData.public_metadata.permissions);
    }

    try {
      const result = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: dataUpdated,
      });
      console.log(chalk.green("✅ User updated successfully"));
      return result;
    } catch (error) {
      console.log(chalk.red("❌ Error updating user:"), error);
      throw error;
    }
  } else {
    console.log(chalk.yellow("👤 User not found, creating new user"));
    return handleUserCreated(userData);
  }
};

export const getUserByExternalId = async (externalId: string) => {
  console.log(chalk.blue("🔍 Looking up user by external ID:"), externalId);

  let user = await prisma.user.findFirst({
    where: {
      externalId: externalId,
    },
  });
  console.log(chalk.cyan("👤 Database lookup result:"), !!user);

  if (!user) {
    console.log(chalk.yellow("⚠️ User not found, fetching from Clerk"));
    const clerkUser = await getClerkUserByExternalId(externalId);
    console.log(chalk.cyan("📥 Creating user from Clerk data"));
    return await handleUserCreated(clerkUser, "request");
  }

  console.log(chalk.green("✅ User found successfully"));
  return user;
};
