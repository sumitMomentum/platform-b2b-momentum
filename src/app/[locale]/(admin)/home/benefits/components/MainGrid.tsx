import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import StatCard, { StatCardProps } from "./StatCard";
import SavingsOverTimeChart from "./SavingsOverTimeChart";
import SavingsDistributionChart from "./SavingsDistributionChart";
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";
import BenefitsListComponent from "../BenefitsListComponent";

export default function MainGrid({ benefits, overall, loading, setLoading }) {
  const [statCardData, setStatCardData] = React.useState<StatCardProps[]>([]);
  const [savingsOverTimeData, setSavingsOverTimeData] = React.useState<number[]>([]);
  const [vehicleBenefits, setVehicleBenefits] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const totalSavings = benefits.reduce(
          (acc, item) => acc + (item.costSavingChargingMonthly || 0),
          0
        );
        const averageSavings = totalSavings / (benefits.length || 1);
        const totalRangeIncrease = benefits.reduce(
          (acc, item) => acc + (item.rangeIncreaseMonthly || 0),
          0
        );

        const formattedStatCardData: StatCardProps[] = [
          {
            title: "Total Savings",
            value: `${totalSavings.toFixed(2)} USD`,
            interval: "Last 30 days",
            trend: totalSavings >= 0 ? "up" : "down",
            data: benefits.map((item) => item.costSavingChargingMonthly || 0),
          },
          {
            title: "Average Savings",
            value: `${averageSavings.toFixed(2)} USD`,
            interval: "Last 30 days",
            trend: averageSavings >= 0 ? "up" : "down",
            data: benefits.map((item) => item.costSavingChargingMonthly || 0),
          },
          {
            title: "Total Range Increase",
            value: `${totalRangeIncrease.toFixed(2)} km`,
            interval: "Last 30 days",
            trend: totalRangeIncrease >= 0 ? "up" : "down",
            data: benefits.map((item) => item.rangeIncreaseMonthly || 0),
          },
        ];

        const savingsOverTime = benefits.map(
          (item) => item.costSavingChargingMonthly || 0
        );

        setStatCardData(formattedStatCardData);
        setSavingsOverTimeData(savingsOverTime);
        setVehicleBenefits(benefits);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [benefits]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={1} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {statCardData.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
        <Grid item xs={12} md={6} lg={6}>
          <SavingsOverTimeChart savingsData={savingsOverTimeData} loading={loading} />
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
