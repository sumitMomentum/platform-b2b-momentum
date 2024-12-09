import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { sevierityChartsPalette } from "@/themes/ChartPalettes";
import CountUp from "react-countup";

export default function SavingsDistributionChart({
  savingsData,
  loading,
}: {
  savingsData: any[];
  loading: boolean;
}) {
  const isDataAvailable = savingsData.length;

  const vehicleData = savingsData
    .filter((item) => item.vehicleId !== "xxxxxxxxxx")
    .map((item) => ({
      label: item.vehicleId,
      value: item.costSavingChargingMonthly,
    }));

  // Example savings data (current and previous period)
  const currentSavings = vehicleData.reduce((acc, item) => acc + item.value, 0);
  const previousSavings = 5000; // Placeholder for previous period savings, replace with actual data
  
  const savingsChange = ((currentSavings - previousSavings) / previousSavings) * 100;
  const savingsChangeLabel = `${Math.abs(savingsChange.toFixed(2))}%`;

  // Determine the chip color based on the change
  const chipColor = savingsChange >= 0 ? 'success' : 'error';

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Savings Distribution by Vehicle
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
              {currentSavings.toLocaleString()} USD
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Savings distribution for vehicles in the last 30 days
            </Typography>
            <Chip size="small" variant="outlined" color={chipColor} label={savingsChangeLabel} />
          </Stack>
        </Stack>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ width: '150%' }}> {/* Increase the width to enable horizontal scroll */}
            <BarChart
              loading={loading}
              borderRadius={8}
              xAxis={[
                {
                  scaleType: "band",
                  data: vehicleData.map((item) => item.label),
                  tickLabelStyle: {
                    angle: -45, // Rotate labels for better visibility
                    fontSize: 12,
                    textAnchor: 'end',
                  },
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
                        data: vehicleData.map((item) => item.value),
                        stack: "A",
                      },
                    ]
                  : []
              }
              height={315}
              margin={{ left: 50, right: 0, top: 20, bottom: 70 }}
              grid={{ horizontal: true }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
