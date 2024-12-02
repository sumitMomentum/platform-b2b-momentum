import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import { ChartsClipPath } from "@mui/x-charts";
import { sevierityChartsPalette } from "@/themes/ChartPalettes";

function getSeverityData(data) {
  let low = 0,
    medium = 0,
    high = 0;

  // Severity mapping
  const severityMapping = {
    Low: "Low",
    Medium: "Medium",
    High: "High",
  };

  // Count the occurrences of each severity level
  data.forEach((action) => {
    if (severityMapping[action.severity]) {
      switch (action.severity) {
        case "Low":
          low++;
          break;
        case "Medium":
          medium++;
          break;
        case "High":
          high++;
          break;
        default:
          break;
      }
    }
  });

  return { low, medium, high };
}

export default function SeverityDistributionChart({
  actionsData = [],
  loading,
}) {
  const theme = useTheme();
  const dataAvailable = actionsData.length;

  // Get the severity data from the vehicle actions
  const { low, medium, high } = getSeverityData(actionsData);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Severity Distribution of Actions
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
              {low + medium + high} Actions
            </Typography>
            <Chip
              size="small"
              color="success"
              label={`+${Math.round(
                ((medium + high) / (low + medium + high)) * 100
              )}%`}
            />{" "}
            {/* Change Chip color to green */}
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Distribution of severity levels in the actions
          </Typography>
        </Stack>
        <BarChart
          loading={loading}
          borderRadius={8}
          // colors={[
          //   sevierityChartsPalette.success,
          //   sevierityChartsPalette.warning,
          //   sevierityChartsPalette.warning,
          // ]}
          xAxis={[
            {
              scaleType: "band",
              data: ["Low", "Medium", "High"],
              colorMap: {
                type: "piecewise",
                thresholds: [1, 2],
                colors: [
                  sevierityChartsPalette.success,
                  sevierityChartsPalette.warning,
                  sevierityChartsPalette.warning,
                ],
              },
            },
          ]}
          series={
            dataAvailable
              ? [
                  {
                    id: "severity",
                    label: "Severity",
                    data: [low, medium, high], // Data for severity counts
                    stack: "A",
                  },
                ]
              : []
          }
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
