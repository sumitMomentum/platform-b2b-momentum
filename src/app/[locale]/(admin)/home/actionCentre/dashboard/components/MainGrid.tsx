import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import CustomizedDataGrid from './CustomizedDataGrid';
import StatCard, { StatCardProps } from './StatCard';
import SavingsOverTimeChart from './SavingsOverTimeChart';
import SavingsDistributionChart from './SavingsDistributionChart';
import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions"; // Make sure this function is correctly imported

// Function to aggregate vehicle data
const aggregateData = (data) => {
  const totalVehicles = data.length;

  // Initialize sum values
  let totalCostSavingChargingLifeTimeEstimate = 0;
  let totalCostSavingChargingMonthly = 0;
  let totalRangeIncreaseMonthly = 0;
  let totalBatteryCycleSavingMonthly = 0;

  // Calculate aggregates, safely handling invalid data
  data.forEach(vehicle => {
    totalCostSavingChargingLifeTimeEstimate += vehicle.costSavingChargingLifeTimeEstimate || 0;
    totalCostSavingChargingMonthly += vehicle.costSavingChargingMonthly || 0;
    totalRangeIncreaseMonthly += vehicle.rangeIncreaseMonthly || 0;
    totalBatteryCycleSavingMonthly += vehicle.batteryCycleSavingMonthly || 0;
  });

  return {
    totalCostSavingChargingLifeTimeEstimate: totalCostSavingChargingLifeTimeEstimate / totalVehicles || 0,
    totalCostSavingChargingMonthly: totalCostSavingChargingMonthly / totalVehicles || 0,
    totalRangeIncreaseMonthly: totalRangeIncreaseMonthly / totalVehicles || 0,
    totalBatteryCycleSavingMonthly: totalBatteryCycleSavingMonthly / totalVehicles || 0
  };
};

export default function MainGrid() {
  const [vehicleDataItems, setVehicleDataItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the actual vehicle data using the function
        const data = await getAllVehicleActions();
        
        // If data is fetched successfully, calculate aggregates
        if (data && Array.isArray(data)) {
          setVehicleDataItems(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch vehicle data items", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Aggregate the data for the stat cards
  const {
    totalCostSavingChargingLifeTimeEstimate,
    totalCostSavingChargingMonthly,
    totalRangeIncreaseMonthly,
    totalBatteryCycleSavingMonthly
  } = aggregateData(vehicleDataItems);

  // Data for the Stat Cards
  const statCards: StatCardProps[] = [
    {
      title: 'Average Savings (Lifetime)',
      value: `${totalCostSavingChargingLifeTimeEstimate.toFixed(2)} USD`,
      interval: 'Lifetime Estimate',
      trend: totalCostSavingChargingLifeTimeEstimate > 10000 ? 'up' : 'neutral',
      data: [
        totalCostSavingChargingMonthly,
        totalCostSavingChargingLifeTimeEstimate
      ], 
    },
    {
      title: 'Average Monthly Charging Savings',
      value: `${totalCostSavingChargingMonthly.toFixed(2)} USD`,
      interval: 'Monthly',
      trend: totalCostSavingChargingMonthly > 500 ? 'up' : 'neutral',
      data: [
        totalCostSavingChargingMonthly,
        totalCostSavingChargingLifeTimeEstimate
      ], 
    },
    {
      title: 'Average Range Increase (Monthly)',
      value: `${totalRangeIncreaseMonthly.toFixed(2)} km`,
      interval: 'Monthly',
      trend: totalRangeIncreaseMonthly > 400 ? 'up' : 'neutral',
      data: [
        totalRangeIncreaseMonthly,
        totalRangeIncreaseMonthly * 12, // Annual estimation
      ], 
    },
    {
      title: 'Average Battery Cycle Savings (Monthly)',
      value: `${totalBatteryCycleSavingMonthly.toFixed(2)} USD`,
      interval: 'Monthly',
      trend: totalBatteryCycleSavingMonthly > 1.5 ? 'up' : 'neutral',
      data: [
        totalBatteryCycleSavingMonthly,
        totalBatteryCycleSavingMonthly * 12, // Annual estimation
      ], 
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Overview Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {/* Stat Cards */}
        {statCards.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} />
          </Grid>
        ))}

        {/* Savings Over Time Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <SavingsOverTimeChart />
        </Grid>
        {/* Savings Distribution Chart */}
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
}
