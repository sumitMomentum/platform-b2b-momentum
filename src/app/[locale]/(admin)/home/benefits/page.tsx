// @ts-ignore
"use client";

import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React, { useEffect, useState } from "react";
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";
import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";
import { log } from "console";

const Benefits = async () => {
  // const t = await getTranslations("AdminLayout.pages.benefits");

  const [vehicleBenefits, setVehicleBenefits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVehicleBenefits(); // Ensure this function returns data as expected
        console.log("Fetched data:", data);
        setVehicleBenefits(data);
      } catch (error) {
        console.error("Error fetching vehicle benefits data:", error);
      }
    };

    fetchData();
  }, []);

  // Check if vehicleBenefits state updates correctly
  console.log("Vehicle Benefits State:", vehicleBenefits);

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
              {vehicleBenefits
                .sort((vehicleBenefitsA, vehicleBenefitsB) => {
                  if (vehicleBenefitsA.vehicleId > vehicleBenefitsB.vehicleId)
                    return -1;
                  if (vehicleBenefitsA.vehicleId < vehicleBenefitsB.vehicleId)
                    return 1;
                  return 0;
                })
                .map((vehicleBenefits, index) => (
                  <tr key={index} className="text-sm">
                    <td className="border px-4 py-2">{vehicleBenefits.vin}</td>
                    <td className="border px-4 py-2">
                      {vehicleBenefits.batteryCycleSavingMonthly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenefits.batteryCycleSavingYearly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenefits.batteryCycleSavingLifetime}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenefits.costSavingChargingMonthly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenefits.costSavingChargingYearly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenefits.costSavingChargingLifeTimeEstimate}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenefits.rangeIncreaseMonthly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenefits.rangeIncreaseYearly}
                    </td>
                    <td className="border px-4 py-2  bg-green-600 hover:bg-green-800  text-white">
                      {vehicleBenefits.rangeIncreaseLifetimeEstimate}
                    </td>
                    <td className="border px-4 py-2  bg-green-600 hover:bg-green-800  text-white">
                      {vehicleBenefits.revenueIncreaseLifetime}
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
