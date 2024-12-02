import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import StatCard, { StatCardProps } from "./StatCard";
import SavingsOverTimeChart from "./SavingsOverTimeChart";
import SavingsDistributionChart from "./SavingsDistributionChart";
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";
import BenefitsListComponent from "../BenefitsListComponent";

export default function MainGrid({ benefits, loading }) {
  const [statCardData, setStatCardData] = React.useState<StatCardProps[]>([]);
  const [savingsOverTimeData, setSavingsOverTimeData] = React.useState<
    number[]
  >([]);
  const [vehicleBenefits, setVehicleBenefits] = React.useState([]);
  // const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // setLoading(true);
    const fetchData = async () => {
      try {
        // Calculate inferences for stat cards
        const totalSavings = benefits.reduce(
          (acc, item) => acc + item.costSavingChargingMonthly,
          0
        );
        const averageSavings = totalSavings / benefits.length || 0;
        const totalRangeIncrease = benefits.reduce(
          (acc, item) => acc + item.rangeIncreaseMonthly,
          0
        );

        const formattedStatCardData: StatCardProps[] = [
          {
            title: "Total Savings",
            value: `${totalSavings.toFixed(2)} USD`,
            interval: "Last 30 days",
            trend: "up",
            data: benefits.map((item) => item.costSavingChargingMonthly),
          },
          {
            title: "Average Savings",
            value: `${averageSavings.toFixed(2)} USD`,
            interval: "Last 30 days",
            trend: "neutral",
            data: benefits.map((item) => item.costSavingChargingMonthly),
          },
          {
            title: "Total Range Increase",
            value: `${totalRangeIncrease.toFixed(2)} km`,
            interval: "Last 30 days",
            trend: "up",
            data: benefits.map((item) => item.rangeIncreaseMonthly),
          },
        ];

        // Savings data over time for the chart
        const savingsOverTime = benefits.map(
          (item) => item.costSavingChargingMonthly
        );

        setStatCardData(formattedStatCardData);
        setSavingsOverTimeData(savingsOverTime);
        setVehicleBenefits(benefits);
        // setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        // setLoading(false);
      }
    };

    fetchData();
  }, [benefits]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Overview Section */}
      {/* <Typography component="h4" variant="h2" sx={{ mb: 2 }}>
        Benefits Overview
      </Typography> */}
      <Grid
        container
        spacing={1}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {/* Stat Cards */}
        {statCardData.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}

        {/* Savings Over Time Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <SavingsOverTimeChart
            savingsData={savingsOverTimeData}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <SavingsDistributionChart
            savingsData={vehicleBenefits}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Details Section */}
      <Grid container spacing={2} columns={12}>
        {/* Data Grid Section */}
        <Grid item xs={12}>
          <BenefitsListComponent benefits={benefits} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
}
