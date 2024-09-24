// @ts-ignore
"use client";

import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React, { useEffect, useState } from "react";
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";
import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";

const Benefits = async () => {
  // const t = await getTranslations("AdminLayout.pages.benefits");

  const vehicleBenifits = await getVehicleBenefits();
  // const [vehicleBenifits, setVehicleBenifits] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await await getVehicleBenefits();
  //       // setVehicleBenifits(data);
  //     } catch (error) {
  //       console.error("Error fetching vehicle benifits data:", error);
  //       // Handle the error appropriately (e.g., show an error message)
  //     }
  //   };

  //   console.log("Hello")

  //   fetchData();
  // }, []);
  // console.log(vehicleBenifits);

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
              {vehicleBenifits
                .sort((vehicleBenifitsA, vehicleBenifitsB) => {
                  if (vehicleBenifitsA.vehicleId > vehicleBenifitsB.vehicleId)
                    return -1;
                  if (vehicleBenifitsA.vehicleId < vehicleBenifitsB.vehicleId)
                    return 1;
                  return 0;
                })
                .map((vehicleBenifits, index) => (
                  <tr key={index} className="text-sm">
                    <td className="border px-4 py-2">{vehicleBenifits.vin}</td>
                    <td className="border px-4 py-2">
                      {vehicleBenifits.BatteryCycleSavingMonthly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenifits.BatterCycleSavingYearly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenifits.BatteryCycleSavingLifetime}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenifits.CostSavingChargingMonthly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenifits.CostSavingChargingYearly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenifits.CostSavingChargingLifeTimeEstimate}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenifits.RangeIncreaseMonthly}
                    </td>
                    <td className="border px-4 py-2">
                      {vehicleBenifits.RangeIncreaseYearly}
                    </td>
                    <td className="border px-4 py-2  bg-green-600 hover:bg-green-800  text-white">
                      {vehicleBenifits.RangeIncreaseLifetimeEstimate}
                    </td>
                    <td className="border px-4 py-2  bg-green-600 hover:bg-green-800  text-white">
                      {vehicleBenifits.RevenueIncreaseLifeTime}
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
