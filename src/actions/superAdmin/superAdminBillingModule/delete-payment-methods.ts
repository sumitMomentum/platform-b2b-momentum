"use server";

import prisma from "@/lib/db";
import { checkPermission } from "@/utils/facades/serverFacades/scurityFacade";
import { getUser } from "@/utils/facades/serverFacades/userFacade";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
const scope = "superAdmin:billing:upsert";

export const deletePaymentMethod = async (paymentMethodId: number) => {
  const userClerk = await auth();
  if (!userClerk) throw new Error("client clerk not found");
  const { permissions } = await getUser(userClerk);

  checkPermission(permissions, scope);

  await prisma.paymentMethod.delete({
    where: {
      id: paymentMethodId,
    },
  });

  revalidatePath("/admin/settings/billing");
};
