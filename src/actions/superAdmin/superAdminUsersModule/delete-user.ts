"use server";
import prisma from "@/lib/db";
import { deleteClerkUser } from "@/utils/facades/serverFacades/clerkFacade";
import { revalidatePath } from "next/cache";
import chalk from "chalk";

export const deleteUser = async (userId: number) => {
  console.log(chalk.blue("🔍 Searching for user..."), { userId });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    console.log(chalk.red("❌ User not found"));
    throw new Error("User not found");
  }

  console.log(chalk.cyan("👤 User found:"), user);

  if (user.externalId) {
    console.log(chalk.yellow("🗑️  Deleting associated Clerk user..."));
    deleteClerkUser(user.externalId);
  }

  console.log(chalk.yellow("⚡ Deleting user from database..."));
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  console.log(chalk.green("✅ User successfully deleted"));
  revalidatePath(`/admin/users`);
};
