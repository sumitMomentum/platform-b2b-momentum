"use client"

import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Grid, Typography, Box, Stack } from "@mui/material";
import StatCard from './StatCard'; // Import the StatCard component
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState } from '@mui/x-charts/Gauge';

const GaugePointer = () => {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  if (valueAngle === null) return null;

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path d={`M ${cx} ${cy} L ${target.x} ${target.y}`} stroke="red" strokeWidth={3} />
    </g>
  );
};

const BenefitsGraphComponent = () => {
  const [vehicleBenefits, setVehicleBenefits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVehicleBenefits();
        setVehicleBenefits(data || []);
      } catch (error) {
        console.error("Error fetching vehicle benefits data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!vehicleBenefits || vehicleBenefits.length === 0) return <div>No data available</div>;

  // Calculate values for the statistics and charts
  const maxSavings = Math.max(...vehicleBenefits.map(item => item.costSavingChargingLifeTimeEstimate));
  const avgSavings = (vehicleBenefits.reduce((sum, item) => sum + item.costSavingChargingLifeTimeEstimate, 0) / vehicleBenefits.length).toFixed(2);
  const filteredMonthlySavings = Math.max(vehicleBenefits.reduce((sum, item) => sum + item.costSavingChargingMonthly, 0) / vehicleBenefits.length, 0);
  const filteredYearlySavings = Math.max(vehicleBenefits.reduce((sum, item) => sum + item.costSavingChargingYearly, 0) / vehicleBenefits.length, 0);
  const filteredLifetimeSavings = Math.max(vehicleBenefits.reduce((sum, item) => sum + item.costSavingChargingLifeTimeEstimate, 0) / vehicleBenefits.length, 0);
  const targetMonthlySavings = 91;
  const gaugeValue = (filteredMonthlySavings / targetMonthlySavings) * 100;

  const pieData = [
    { name: 'Lifetime Savings', value: filteredLifetimeSavings },
    { name: 'Yearly Savings', value: filteredYearlySavings },
    { name: 'Monthly Savings', value: filteredMonthlySavings },
  ];

  const COLORS = ['#28a745', '#ffeb3b', '#ff0000']; // green, yellow, red

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, padding: 2 }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>Overview</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Highest Savings" value={`₹${maxSavings}`} interval="Lifetime" trend="up" icon={<ArrowUpwardIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Average Savings" value={`₹${avgSavings}`} interval="Lifetime" trend="up" icon={<ArrowUpwardIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Monthly Savings" value={`₹${filteredMonthlySavings}`} interval="Monthly" trend="up" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Yearly Savings" value={`₹${filteredYearlySavings}`} interval="Yearly" trend="up" />
        </Grid>
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mt: 4, mb: 2 }}>Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" align="center" fontWeight="bold">Savings Over Time</Typography>
          <BarChart
            series={[
              { data: [filteredMonthlySavings], label: "Monthly Savings" },
              { data: [filteredYearlySavings], label: "Yearly Savings" },
              { data: [filteredLifetimeSavings], label: "Lifetime Savings" }
            ]}
            height={400}
            xAxis={[{ data: ['Savings'], scaleType: 'band' }]}
            margin={{ top: 10, bottom: 60, left: 40, right: 10 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" align="center" fontWeight="bold">Savings Distribution</Typography>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              isAnimationActive
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" align="center" fontWeight="bold">Average Monthly Savings Compared to Target</Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <GaugeContainer width={200} height={200} startAngle={-110} endAngle={110} value={gaugeValue} text={({ value }) => `${value.toFixed(1)}%`}>
              <GaugeReferenceArc />
              <GaugeValueArc />
              <GaugePointer />
            </GaugeContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BenefitsGraphComponent;
