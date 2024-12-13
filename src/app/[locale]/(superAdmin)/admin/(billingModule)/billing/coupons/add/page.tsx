import PageName from "@/components/ui/commons/PageName";
import React from "react";
import { Metadata } from "next";
import UpsertCoupon from "../ui/UpsertCoupon";

export const metadata: Metadata = {
  title: "New Coupon",
};

const SuperAdminBillingCouponModuleAddPage = () => {
  return (
    <div>
      <PageName
      name="New Coupon"
        breadcrumbs={[
          {
            name: "Coupons",
            href: "/admin/billing/coupons",
          },
        ]}
      />
      <UpsertCoupon />
    </div>
  );
};

export default SuperAdminBillingCouponModuleAddPage;
