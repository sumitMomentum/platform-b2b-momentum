import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

interface DegradationChartProps {
  actualDegradation?: number[];
  estimatedDegradation?: number[];
  vehicleIds?: string[];  // Array of Vehicle IDs for the x-axis
  loading: boolean;
}

const DegradationChart: React.FC<DegradationChartProps> = ({
  actualDegradation = [],
  estimatedDegradation = [],
  vehicleIds = [],
  loading,
}) => {
  const isDataAvailable =
    actualDegradation.length > 0 && estimatedDegradation.length > 0;

  // Calculate the total difference and percentage
  const totalActual = actualDegradation.reduce((sum, value) => sum + value, 0);
  const totalEstimated = estimatedDegradation.reduce(
    (sum, value) => sum + value,
    0
  );
  const degradationDifference = totalActual - totalEstimated;
  const percentageDifference =
    ((degradationDifference / totalEstimated) * 100).toFixed(2);

  const differenceLabel = `${degradationDifference >= 0 ? "+" : ""}${percentageDifference}%`;
  const chipColor = degradationDifference >= 0 ? "error" : "success";

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Actual vs Estimated Degradation
        </Typography>
        <Stack spacing={2}>
          {/* Total Degradation and Percentage Difference */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" component="p">
              {totalActual.toFixed(2)} (Actual)
            </Typography>
            <Chip size="small" color={chipColor} label={differenceLabel} />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Comparison of degradation across vehicles
          </Typography>
        </Stack>

        {/* Line Chart */}
        <LineChart
          loading={loading}
          xAxis={[
            {
              scaleType: "point",
              data: vehicleIds,
              tickInterval: (index) => (index + 1) % 5 === 0,
            },
          ]}
          series={
            isDataAvailable
              ? [
                  {
                    id: "actual",
                    label: "Actual Degradation",
                    data: actualDegradation,
                    area: true,
                    showMark: false,
                    color: "#ff9800", // Orange for actual degradation
                  },
                  {
                    id: "estimated",
                    label: "Estimated Degradation",
                    data: estimatedDegradation,
                    area: true,
                    showMark: false,
                    color: "#388e3c", // Green for estimated degradation
                  },
                ]
              : []
          }
          width={600}
          height={400}
          margin={{ left: 70 }}
        />
      </CardContent>
    </Card>
  );
};

export default DegradationChart;
