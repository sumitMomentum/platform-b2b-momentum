"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import CountUp from "react-countup";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", { month: "short" });
  const daysInMonth = date.getDate();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(`${monthName} ${i}`);
  }
  return days;
}

export default function ActionsClosedOverTimeChart({
  data,
  loading,
}: {
  data: {
    closed: { [key: string]: number[] };
    open: { [key: string]: number[] };
  };
  loading: boolean;
}) {
  const theme = useTheme();
  const dataAvailable = Object.keys(data.closed).length || Object.keys(data.open).length;
  
  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const currentMonthYear = `${currentMonth}-${currentYear}`;

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // Get data for current month and year
  const closedActionsData = data.closed[currentMonthYear] || [];
  const openActionsData = data.open[currentMonthYear] || [];

  // Ensure arrays have the same length as the number of days in the month
  const actionsClosed = daysInMonth.map(
    (_, index) => closedActionsData[index] || 0
  );
  const actionsOpen = daysInMonth.map(
    (_, index) => openActionsData[index] || 0
  );

  // Updated color palette with colors for closed and open actions
  const colorPalette = {
    closed: theme.palette.success.main,
    open: theme.palette.warning.main,
  };

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Actions Closed and Open Over Time
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {loading ? (
                0
              ) : (
                <CountUp
                  end={
                    actionsClosed.reduce((acc, val) => acc + val, 0) +
                    actionsOpen.reduce((acc, val) => acc + val, 0)
                  }
                />
              )}
              {} Actions
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Number of actions closed and open each day for the selected month
            </Typography>
            <Chip
              size="small"
              color="success"
              label={`Closed: ${Math.round(
                actionsClosed.reduce((acc, val) => acc + val, 0) /
                  (actionsClosed.length || 1) // Prevent division by zero
              )} avg`}
            />
            <Chip
              size="small"
              color="warning"
              label={`Open: ${Math.round(
                actionsOpen.reduce((acc, val) => acc + val, 0) /
                  (actionsOpen.length || 1) // Prevent division by zero
              )} avg`}
            />
          </Stack>
        </Stack>
        <LineChart
          loading={loading}
          colors={[colorPalette.closed, colorPalette.open]}
          xAxis={[
            {
              scaleType: "point",
              data: daysInMonth,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={
            dataAvailable
              ? [
                  {
                    id: "actionsClosed",
                    label: "Actions Closed",
                    showMark: false,
                    curve: "linear",
                    stack: "total",
                    area: true,
                    stackOrder: "ascending",
                    data: actionsClosed,
                    color: colorPalette.closed,
                  },
                  {
                    id: "actionsOpen",
                    label: "Actions Open",
                    showMark: false,
                    curve: "linear",
                    stack: "total",
                    area: true,
                    stackOrder: "ascending",
                    data: actionsOpen,
                    color: colorPalette.open,
                  },
                ]
              : []
          }
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-actionsClosed": {
              fill: "url('#actionsClosed')",
            },
            "& .MuiAreaElement-series-actionsOpen": {
              fill: "url('#actionsOpen')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.success.main} id="actionsClosed" />
          <AreaGradient color={theme.palette.warning.main} id="actionsOpen" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
