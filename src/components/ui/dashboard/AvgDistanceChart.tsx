"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { DashboardAccessOut } from "svix";
import { BarChart } from "@mui/x-charts/BarChart";
import { Average } from "next/font/google";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
const AvgDistanceChart = ({ dashboardData }) => {
  const theme = useTheme();
  const series = [
    {
      label: "Average Distance (kms)",
      data: dashboardData.monthlyUsage,
      color: `#77bc3f`,
    },
  ];

  const xLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <BarChart
      width={700}
      height={300}
      series={series}
      xAxis={[{ data: xLabels, scaleType: "band" }]}
    />
  );
};

export default AvgDistanceChart;
