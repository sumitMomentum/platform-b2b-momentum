"use server";

import { auth } from "@clerk/nextjs/server";

// Define the required types directly here
type BenefitItem = {
  vin: string;
  vehicleId: string;
  batteryCycleSavingMonthly: number;
  batteryCycleSavingYearly: number;
  batteryCycleSavingLifetime: number;
  costSavingChargingMonthly: number;
  costSavingChargingYearly: number;
  costSavingChargingLifeTimeEstimate: number;
  rangeIncreaseMonthly: number;
  rangeIncreaseYearly: number;
  rangeIncreaseLifetimeEstimate: number;
  revenueIncreaseLifetime: number;
};

type Overall = {
  overallProfit: BenefitItem;
  overallLoss: BenefitItem;
};

type VehicleBenefitsResponse = {
  benefits: BenefitItem[];
  overall: Overall;
};

export const getVehicleBenefits =
  async (): Promise<VehicleBenefitsResponse> => {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Fetch the benefits data from the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/benefits`
    );

    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to fetch benefits data");
    }

    const benefits: BenefitItem[] = await response.json();

    const overallProfit: BenefitItem = {
      vin: "Total gains",
      vehicleId: "Overall",
      batteryCycleSavingMonthly: 0,
      batteryCycleSavingYearly: 0,
      batteryCycleSavingLifetime: 0,
      costSavingChargingMonthly: 0,
      costSavingChargingYearly: 0,
      costSavingChargingLifeTimeEstimate: 0,
      rangeIncreaseMonthly: 0,
      rangeIncreaseYearly: 0,
      rangeIncreaseLifetimeEstimate: 0,
      revenueIncreaseLifetime: 0,
    };

    const overallLoss: BenefitItem = {
      vin: "Total loss",
      vehicleId: "Overall",
      batteryCycleSavingMonthly: 0,
      batteryCycleSavingYearly: 0,
      batteryCycleSavingLifetime: 0,
      costSavingChargingMonthly: 0,
      costSavingChargingYearly: 0,
      costSavingChargingLifeTimeEstimate: 0,
      rangeIncreaseMonthly: 0,
      rangeIncreaseYearly: 0,
      rangeIncreaseLifetimeEstimate: 0,
      revenueIncreaseLifetime: 0,
    };

    benefits.forEach((benefit) => {
      if (benefit.costSavingChargingMonthly > 0) {
        Object.keys(overallProfit).forEach((key) => {
          if (key !== "vin" && key !== "vehicleId") {
            overallProfit[key] += benefit[key];
          }
        });
      } else {
        Object.keys(overallLoss).forEach((key) => {
          if (key !== "vin" && key !== "vehicleId") {
            overallLoss[key] += benefit[key];
          }
        });
      }
    });

    return {
      benefits,
      overall: {
        overallProfit,
        overallLoss,
      },
    };
  };
