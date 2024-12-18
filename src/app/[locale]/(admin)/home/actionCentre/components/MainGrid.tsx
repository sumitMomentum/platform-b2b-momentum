"use client";

import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StatCard, { StatCardProps } from "./StatCard";
import ActionsClosedOverTimeChart from "./ActionsOverTimeChart";
import SeverityDistributionChart from "./SeverityDistributionChart";
import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions";
import SuspenseDashboard from "@/components/suspenseSkeleton/SuspenseDashboard";
import ActionListComponent from "../ActionListComponent";

// Function to aggregate vehicle actions data
const aggregateData = (data) => {
  const totalActions = data.length;
  let confirmedActions = 0;
  let totalSeverityValue = 0;

  // Define severity mapping for numerical calculation
  const severityMapping = {
    Low: 1,
    Medium: 2,
    High: 3,
  };

  // Calculate aggregates
  const monthlyClosedActions = {};
  const monthlyOpenActions = {};

  data.forEach((action) => {
    // Count confirmed actions
    if (action.confirm) {
      confirmedActions++;
    }

    // Calculate total severity score
    totalSeverityValue += severityMapping[action.severity] || 0;

    // Count closed actions per month
    const monthYearClosed = `${
      new Date(action.closedDateTime).getMonth() + 1
    }-${new Date(action.closedDateTime).getFullYear()}`;
    if (!monthlyClosedActions[monthYearClosed]) {
      monthlyClosedActions[monthYearClosed] = [];
    }
    if (action.confirm) {
      monthlyClosedActions[monthYearClosed].push(new Date(action.closedDateTime).getDate());
    }

    // Count open actions per month
    const monthYearOpen = `${
      new Date(action.createdDateTime).getMonth() + 1
    }-${new Date(action.createdDateTime).getFullYear()}`;
    if (!monthlyOpenActions[monthYearOpen]) {
      monthlyOpenActions[monthYearOpen] = [];
    }
    if (!action.confirm) {
      monthlyOpenActions[monthYearOpen].push(new Date(action.createdDateTime).getDate());
    }
  });

  // Calculate averages
  const avgSeverity = totalActions ? totalSeverityValue / totalActions : 0;
  const avgTimeToClose = confirmedActions ? totalActions / confirmedActions : 0; // Divide total actions by confirmed actions

  // Calculate metrics for chips with handling for no data cases
  const totalActionsTrend = totalActions ? ((totalActions - 50) / 50) * 100 : 0;
  const confirmedActionsRate = totalActions ? (confirmedActions / totalActions) * 100 : 0;
  const avgSeverityTrend = avgSeverity ? ((avgSeverity - 2) / 2) * 100 : 0;
  const avgTimeToCloseTrend = avgTimeToClose ? ((24 - avgTimeToClose) / 24) * 100 : 0;

  return {
    totalActions,
    confirmedActions,
    avgSeverity,
    avgTimeToClose,
    monthlyClosedActions,
    monthlyOpenActions,
    totalActionsTrend,
    confirmedActionsRate,
    avgSeverityTrend,
    avgTimeToCloseTrend,
  };
};

export default function MainGrid({ actions, loading }) {
  // Aggregate the data for the stat cards
  const {
    totalActions,
    confirmedActions,
    avgSeverity,
    avgTimeToClose,
    monthlyClosedActions,
    monthlyOpenActions,
    totalActionsTrend,
    confirmedActionsRate,
    avgSeverityTrend,
    avgTimeToCloseTrend,
  } = aggregateData(actions);

  // Map success and error to up and down for trend
  const getTrend = (value, threshold, higherBetter = true) => {
    if (higherBetter) {
      return value > threshold ? "up" : "down";
    } else {
      return value < threshold ? "up" : "down";
    }
  };

  // Data for the Stat Cards
  const statCards: StatCardProps[] = [
    {
      title: "Total Actions Taken",
      value: `${totalActions}`,
      interval: "All Time",
      trend: getTrend(totalActions, 50),
      data: [totalActions],
      loading: loading,
      chipLabel: `${Math.abs(Number(totalActionsTrend.toFixed(2)))}%`, // Use the calculated trend value without sign
    },
    {
      title: "Confirmed Actions",
      value: `${confirmedActions}`,
      interval: "All Time",
      trend: getTrend(confirmedActions, totalActions / 2),
      data: [confirmedActions],
      loading: loading,
      chipLabel: `${Math.abs(Number(confirmedActionsRate.toFixed(2)))}%`, // Use the confirmation rate without sign
    },
    {
      title: "Average Severity Level",
      value: `${avgSeverity.toFixed(2)}`, // Severity level as a decimal
      interval: "All Time",
      trend: getTrend(avgSeverity, 2, false), // Lower severity is better
      data: [avgSeverity],
      loading: loading,
      chipLabel: `${Math.abs(Number(avgSeverityTrend.toFixed(2)))}%`, // Use the calculated severity trend without sign
    },
    {
      title: "Average Time to Close (days)",
      value: `${  avgTimeToClose} days`, // Display average time to close in days
      interval: "All Time",
      trend: getTrend(avgTimeToClose, 24, false), // Assuming actions closed in < 24hrs is good
      data: [avgTimeToClose],
      loading: loading,
      chipLabel: `${Math.abs(Number(avgTimeToCloseTrend.toFixed(2)))}%`, // Use the calculated time to close trend without sign
    },    
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Overview Section */}
      <Grid container spacing={1} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {/* Stat Cards */}
        {statCards.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} />
          </Grid>
        ))}

        {/* Actions Closed Over Time Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <ActionsClosedOverTimeChart
            data={{
              closed: monthlyClosedActions,
              open: monthlyOpenActions,
            }}
            loading={loading}
          />
        </Grid>

        {/* Severity Distribution Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <SeverityDistributionChart actionsData={actions} loading={loading} />
        </Grid>
      </Grid>

      {/* Details Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        {/* Data Grid Section */}
        <Grid item xs={12}>
          {/* <CustomizedDataGrid /> */}
          <ActionListComponent actions={actions} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
}
