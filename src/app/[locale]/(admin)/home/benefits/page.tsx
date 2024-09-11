import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";

const Benefits = async () => {
  // const t = await getTranslations("AdminLayout.pages.benefits");

  const actionItems = await getVehicleBenefits();

  // console.log(actionItems);

  return (
    <div>
      <PageName
        // name={t("title")}
        name={"Benefits"}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Benefits", href: "/home/benefits" },
        ]}
      />
      <div className="container">
        <div className="max-h-screen overflow-y-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border px-2 py-2">VIN</th>
                <th className="border px-2 py-2">
                  Battery Cycle Saving (Monthly)
                </th>
                <th className="border px-2 py-2">
                  Battery Cycle Saving (Yearly)
                </th>
                <th className="border px-2 py-2">
                  Battery Cycle Saving (Lifetime)
                </th>
                <th className="border px-2 py-2">
                  Cost Saving Charging (Monthly)
                </th>
                <th className="border px-2 py-2">
                  Cost Saving Charging (Yearly)
                </th>
                <th className="border px-2 py-2">
                  Cost Saving Charging (Lifetime Estimate)
                </th>
                <th className="border px-2 py-2">Range Increase (Monthly)</th>
                <th className="border px-2 py-2">Range Increase (Yearly)</th>
                <th className="border px-2 py-2">
                  Range Increase (Lifetime Estimate)
                </th>
                <th className="border px-2 py-2">
                  Revenue Increase (Lifetime)
                </th>
              </tr>
            </thead>
            <tbody>
              {actionItems.map((actionItem, index) => (
                <tr key={index} className="text-sm">
                  <td className="border px-4 py-2">{actionItem.vin}</td>
                  <td className="border px-4 py-2">
                    {actionItem.BatteryCycleSavingMonthly}
                  </td>
                  <td className="border px-4 py-2">
                    {actionItem.BatterCycleSavingYearly}
                  </td>
                  <td className="border px-4 py-2">
                    {actionItem.BatteryCycleSavingLifetime}
                  </td>
                  <td className="border px-4 py-2">
                    {actionItem.CostSavingChargingMonthly}
                  </td>
                  <td className="border px-4 py-2">
                    {actionItem.CostSavingChargingYearly}
                  </td>
                  <td className="border px-4 py-2">
                    {actionItem.CostSavingChargingLifeTimeEstimate}
                  </td>
                  <td className="border px-4 py-2">
                    {actionItem.RangeIncreaseMonthly}
                  </td>
                  <td className="border px-4 py-2">
                    {actionItem.RangeIncreaseYearly}
                  </td>
                  <td className="border px-4 py-2  bg-green-600 hover:bg-green-800  text-white">
                    {actionItem.RangeIncreaseLifetimeEstimate}
                  </td>
                  <td className="border px-4 py-2  bg-green-600 hover:bg-green-800  text-white">
                    {actionItem.RevenueIncreaseLifeTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
