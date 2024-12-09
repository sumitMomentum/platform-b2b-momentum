import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

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

  if (!vehicleIds || vehicleIds.length === 0) {
    return <div>No data available</div>;
  }

  const isDataAvailable =
    actualDegradation.length > 0 && estimatedDegradation.length > 0 && vehicleIds.length > 0;

  // Merge data into a single dataset
  const dataset = vehicleIds.map((id, index) => ({
    vehicleId: id,
    actualDegradation: actualDegradation[index] * 100, // Multiply by 100 to show percentage
    estimatedDegradation: estimatedDegradation[index] * 100, // Multiply by 100 to show percentage
  }));

  // Calculate the total difference and percentage
  const totalActual = actualDegradation.reduce((sum, value) => sum + value, 0); // Keep as original
  const totalEstimated = estimatedDegradation.reduce((sum, value) => sum + value, 0); // Keep as original
  const degradationDifference = totalEstimated - totalActual;
  const totalDegradation = totalEstimated + totalActual;
  const percentageDifference = ((degradationDifference / totalDegradation) * 100).toFixed(2);

  const differenceLabel = `Reduced by ${percentageDifference}%`;
  const chipColor = degradationDifference >= 0 ? "success" : "error";

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Actual vs Estimated Degradation
        </Typography>
        <Stack spacing={2}>
          {/* Total Degradation Reduced By and Percentage Difference */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" component="p">
              Degradation Reduced by {degradationDifference.toFixed(2)}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Comparison of degradation across vehicles
            </Typography>
            <Chip size="small" variant="outlined" color={chipColor} label={differenceLabel} />
          </Stack>
        </Stack>

        {/* Line Chart with Horizontal Scrolling */}
        {isDataAvailable && (
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Box sx={{ width: '150%' }}> {/* Adjust the width as needed */}
              <LineChart
                dataset={dataset}
                xAxis={[
                  {
                    id: "Vehicles",
                    dataKey: "vehicleId",
                    scaleType: "point",
                    valueFormatter: (id) => id,
                    tickLabelStyle: {
                      angle: -45, // Rotate labels for better visibility
                      fontSize: 12,
                      textAnchor: 'end',
                    },
                  },
                ]}
                yAxis={[
                  {
                    id: "Degradation",
                    valueFormatter: (value) => `${value.toFixed(2)}%`, // Show percentage with % sign
                  },
                ]}
                series={[
                  {
                    id: "estimated",
                    label: "Estimated Degradation",
                    dataKey: "estimatedDegradation",
                    showMark: false,
                    color: "#388e3c", // Green for estimated degradation
                    valueFormatter: (value) => `${value.toFixed(2)}%`, // Show percentage with % sign on hover
                  },
                  {
                    id: "actual",
                    label: "Actual Degradation",
                    dataKey: "actualDegradation",
                    showMark: false,
                    color: "#ff9800", // Orange for actual degradation
                    valueFormatter: (value) => `${value.toFixed(2)}%`, // Show percentage with % sign on hover
                  },
                ]}
                height={300}  // Increase the height to ensure labels are fully visible
                width={1000}  // Increase the width to enable horizontal scroll
                margin={{ left: 70, bottom: 100 }}  // Increase bottom margin for label visibility
                loading={loading}
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DegradationChart;
