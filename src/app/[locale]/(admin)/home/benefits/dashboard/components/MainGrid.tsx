import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import CustomizedDataGrid from './CustomizedDataGrid';
import StatCard, { StatCardProps } from './StatCard';
import SavingsOverTimeChart from './SavingsOverTimeChart';
import SavingsDistributionChart from './SavingsDistributionChart';

const data: StatCardProps[] = [
  {
    title: 'Total Savings',
    value: '10,000 USD',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      2000, 1500, 1800, 2500, 3000, 2200, 1900, 2000, 1500, 1800, 2500, 3000, 3200, 3900, 4200, 4400, 4600
    ], // 17 data points
  },
  {
    title: 'Average Savings',
    value: '500 USD',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      1500, 1200, 1400, 1700, 1800, 1600, 1500, 1400, 1600, 1700, 1500, 1300, 1500, 1600, 1700, 1800, 1900
    ], // 17 data points
  },
  {
    title: 'Savings in Charging',
    value: '3,000 USD',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      1500, 1200, 1400, 1700, 1800, 1600, 1500, 1600, 1400, 1500, 1600, 1700, 1800, 1900, 1600, 1700, 1800
    ], // 17 data points
  },
  {
    title: 'Savings in Battery Life',
    value: '2,500 USD',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      1000, 800, 900, 1200, 1300, 1000, 1100, 1200, 1300, 1200, 1000, 1100, 1200, 1300, 1400, 1500, 1600
    ], // 17 data points
  },
];

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Overview Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {/* Stat Cards */}
        {data.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} />
          </Grid>
        ))}

        {/* Sessions and Page Views Charts */}
        <Grid item xs={12} md={6} lg={6}>
          <SavingsOverTimeChart />
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
}
