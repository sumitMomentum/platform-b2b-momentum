import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import { sevierityChartsPalette } from "@/themes/ChartPalettes";
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

function getDaysInMonth(month: number, year: number, numOfDays: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const days = [];
  let i = 1;
  while (days.length < numOfDays) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function SavingsOverTimeChart({
  savingsData = [],
  loading,
}: {
  savingsData?: number[];
  loading: boolean;
}) {
  const theme = useTheme();
  const daysInMonth = 30; // For April, we have 30 days
  const data = getDaysInMonth(4, 2024, daysInMonth); // Adjusted to have 30 days for April
  const isDataAvailable = savingsData.length;
  // // Updated color palette with green shades
  // const colorPalette = [
  //   theme.palette.primary.dark, // Light green
  //   theme.palette.primary.main, // Medium green
  //   theme.palette.primary.light, // Dark green
  // ];

  // Calculate total and average savings
  const totalSavings = savingsData.reduce((acc, val) => acc + val, 0);
  const averageSavings = totalSavings / savingsData.length;

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Savings Over Time
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
              {loading ? 0 : <CountUp end={Number(totalSavings.toFixed(2))} />}{" "}
              {/* {totalSavings.toFixed(2)}{" "}  */}
              USD
            </Typography>
            <Chip
              variant="outlined"
              size="small"
              color="success"
              label={`+${Math.round(averageSavings)}%`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Total savings per day for the last 30 days
          </Typography>
        </Stack>
        <LineChart
          loading={loading}
          xAxis={[
            {
              scaleType: "point",
              data,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          yAxis={[
            {
              colorMap: {
                type: "piecewise",
                thresholds: [0],
                colors: [
                  sevierityChartsPalette.error,
                  sevierityChartsPalette.success,
                ],
              },
            },
          ]}
          series={
            isDataAvailable
              ? [
                  {
                    id: "savings",
                    label: "Savings",
                    showMark: false,
                    curve: "linear",
                    stack: "total",
                    area: true,
                    stackOrder: "ascending",
                    data: savingsData, // Use the real savings data
                  },
                ]
              : []
          }
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-savings": {
              fill: "url('#savings')", // Apply the green gradient
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.success.dark} id="savings" />{" "}
          {/* Green gradient */}
        </LineChart>
      </CardContent>
    </Card>
  );
}
