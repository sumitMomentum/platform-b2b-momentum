import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import CustomizedDataGrid from './CustomizedDataGrid';
import StatCard, { StatCardProps } from './StatCard';
import SavingsOverTimeChart from './SavingsOverTimeChart';
import SavingsDistributionChart from './SavingsDistributionChart';
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";

const MainGrid = () => {
  const [statCardData, setStatCardData] = React.useState<StatCardProps[]>([]);
  const [savingsOverTimeData, setSavingsOverTimeData] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVehicleBenefits();

        // Calculate inferences for stat cards
        const totalSavings = response.reduce((acc, item) => acc + item.costSavingChargingMonthly, 0);
        const averageSavings = (totalSavings / response.length) || 0;
        const totalRangeIncrease = response.reduce((acc, item) => acc + item.rangeIncreaseMonthly, 0);

        const formattedStatCardData = [
          {
            title: 'Total Savings',
            value: `${totalSavings.toFixed(2)} USD`,
            interval: 'Last 30 days',
            trend: 'up',
            data: response.map(item => item.costSavingChargingMonthly)
          },
          {
            title: 'Average Savings',
            value: `${averageSavings.toFixed(2)} USD`,
            interval: 'Last 30 days',
            trend: 'neutral',
            data: response.map(item => item.costSavingChargingMonthly)
          },
          {
            title: 'Total Range Increase',
            value: `${totalRangeIncrease.toFixed(2)} km`,
            interval: 'Last 30 days',
            trend: 'up',
            data: response.map(item => item.rangeIncreaseMonthly)
          }
        ];

        // Savings data over time for the chart
        const savingsOverTime = response.map(item => item.costSavingChargingMonthly);

        setStatCardData(formattedStatCardData);
        setSavingsOverTimeData(savingsOverTime);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Overview Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {/* Stat Cards */}
        {statCardData.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} />
          </Grid>
        ))}

        {/* Savings Over Time Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <SavingsOverTimeChart savingsData={savingsOverTimeData} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <SavingsDistributionChart />
        </Grid>
      </Grid>

      {/* Details Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        {/* Data Grid Section */}
        <Grid>
          <CustomizedDataGrid />
        </Grid>
      </Grid>

      {/* Footer */}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
};

export default MainGrid;
