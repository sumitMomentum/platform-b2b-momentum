import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import StatCard, { StatCardProps } from "./StatCard";
import DegradationChart from "./DegradationChart";
import SavingsDistributionChart from "./SavingsDistributionChart";
import BenefitsListComponent from "../BenefitsListComponent";

interface MainGridProps {
  benefits: any[];
  overall: any;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function MainGrid({ benefits, overall, loading, setLoading }: MainGridProps) {
  const [statCardData, setStatCardData] = React.useState<StatCardProps[]>([]);
  const [vehicleBenefits, setVehicleBenefits] = React.useState<any[]>([]);
  const [actualDegradationData, setActualDegradationData] = React.useState<number[]>([]);
  const [estimatedDegradationData, setEstimatedDegradationData] = React.useState<number[]>([]);

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const totalSavings = benefits.reduce(
          (acc, item) => acc + (item.costSavingChargingMonthly || 0),
          0
        );
        const previousTotalSavings = totalSavings * 0.9;
        const savingsChange = ((totalSavings - previousTotalSavings) / previousTotalSavings) * 100;

        const averageSavings = totalSavings / (benefits.length || 1);
        const previousAverageSavings = averageSavings * 0.9;
        const averageSavingsChange = ((averageSavings - previousAverageSavings) / previousAverageSavings) * 100;

        const totalRangeIncrease = benefits.reduce(
          (acc, item) => acc + (item.rangeIncreaseMonthly || 0),
          0
        );
        const previousTotalRangeIncrease = totalRangeIncrease * 0.9;
        const rangeIncreaseChange = ((totalRangeIncrease - previousTotalRangeIncrease) / previousTotalRangeIncrease) * 100;

        const formattedStatCardData: StatCardProps[] = [
          {
            title: "Total Savings",
            value: `${totalSavings.toFixed(2)} USD`,
            interval: "Last 30 days",
            trend: savingsChange >= 0 ? "up" : "down",
            data: benefits.map((item) => item.costSavingChargingMonthly || 0),
            chip: {
              label: `${savingsChange.toFixed(2)}%`,
              color: savingsChange >= 0 ? "success" : "error",
            },
          },
          {
            title: "Average Savings",
            value: `${averageSavings.toFixed(2)} USD`,
            interval: "Last 30 days",
            trend: averageSavingsChange >= 0 ? "up" : "down",
            data: benefits.map((item) => item.costSavingChargingMonthly || 0),
            chip: {
              label: `${averageSavingsChange.toFixed(2)}%`,
              color: averageSavingsChange >= 0 ? "success" : "error",
            },
          },
          {
            title: "Total Range Increase",
            value: `${totalRangeIncrease.toFixed(2)} km`,
            interval: "Last 30 days",
            trend: rangeIncreaseChange >= 0 ? "up" : "down",
            data: benefits.map((item) => item.rangeIncreaseMonthly || 0),
            chip: {
              label: `${rangeIncreaseChange.toFixed(2)}%`,
              color: rangeIncreaseChange >= 0 ? "success" : "error",
            },
          },
        ];

        const actualDegradation = benefits.map((item) => item.actualDegradation || 0);
        const estimatedDegradation = benefits.map((item) => item.estimatedDegradation || 0);

        setStatCardData(formattedStatCardData);
        setActualDegradationData(actualDegradation);
        setEstimatedDegradationData(estimatedDegradation);
        setVehicleBenefits(benefits);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [benefits, setLoading]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={1} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {statCardData.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
        <Grid item xs={12} md={6} lg={6}>
          <DegradationChart
            actualDegradation={actualDegradationData}
            estimatedDegradation={estimatedDegradationData}
            vehicleIds={vehicleBenefits.map((benefit) => benefit.vehicleId)} // Assuming vehicleId is part of each benefit
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <SavingsDistributionChart savingsData={vehicleBenefits} loading={loading} />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12}>
        <Grid item xs={12}>
          <BenefitsListComponent
            benefits={benefits}
            overall={overall}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
