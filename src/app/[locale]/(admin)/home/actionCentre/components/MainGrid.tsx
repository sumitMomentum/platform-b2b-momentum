import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import StatCard, { StatCardProps } from "./StatCard";
import ActionsClosedOverTimeChart from "./ActionsOverTimeChart";
import SeverityDistributionChart from "./SeverityDistributionChart";
import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions"; // Ensure this is correct
import CustomizedDataGrid from "./CustomizedDataGrid";
import SuspenseDashboard from "@/components/suspenseSkeleton/SuspenseDashboard";

// Function to aggregate vehicle actions data
const aggregateData = (data) => {
  const totalActions = data.length;
  let confirmedActions = 0;
  let totalSeverityValue = 0;
  let totalTimeToClose = 0;

  // Define severity mapping for numerical calculation
  const severityMapping = {
    Low: 1,
    Medium: 2,
    High: 3,
  };

  // Calculate aggregates
  data.forEach((action) => {
    // Count confirmed actions
    if (action.confirm) {
      confirmedActions++;
    }

    // Calculate total severity score
    totalSeverityValue += severityMapping[action.severity] || 0;

    // Calculate time to close (in hours)
    const createdDate = new Date(action.createdDateTime);
    const closedDate = new Date(action.closedDateTime);
    const timeToClose =
      (closedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60); // Convert ms to hours
    // Convert ms to hours
    totalTimeToClose += timeToClose || 0;
  });

  // Calculate averages
  const avgSeverity = totalSeverityValue / totalActions || 0;
  const avgTimeToClose = totalTimeToClose / totalActions || 0;

  return {
    totalActions,
    confirmedActions,
    avgSeverity,
    avgTimeToClose,
  };
};

export default function MainGrid() {
  const [vehicleDataItems, setVehicleDataItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the actual vehicle actions data
        const data = await getAllVehicleActions();

        // If data is fetched successfully, calculate aggregates
        if (data && Array.isArray(data)) {
          setVehicleDataItems(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch vehicle data items", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aggregate the data for the stat cards
  const { totalActions, confirmedActions, avgSeverity, avgTimeToClose } =
    aggregateData(vehicleDataItems);

  // Data for the Stat Cards
  const statCards: StatCardProps[] = [
    {
      title: "Total Actions Taken",
      value: `${totalActions}`,
      interval: "All Time",
      trend: totalActions > 50 ? "up" : "neutral",
      data: [totalActions],
    },
    {
      title: "Confirmed Actions",
      value: `${confirmedActions}`,
      interval: "All Time",
      trend: confirmedActions > totalActions / 2 ? "up" : "neutral",
      data: [confirmedActions],
    },
    {
      title: "Average Severity Level",
      value: `${avgSeverity.toFixed(2)}`, // Severity level as a decimal
      interval: "All Time",
      trend: avgSeverity > 2 ? "up" : "neutral", // Severity greater than 2 means high
      data: [avgSeverity],
    },
    {
      title: "Average Time to Close (hrs)",
      value: `${avgTimeToClose.toFixed(2)} hrs`,
      interval: "All Time",
      trend: avgTimeToClose < 24 ? "down" : "neutral", // Assuming actions closed in < 24hrs is good
      data: [avgTimeToClose],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Overview Section */}
      <Typography component="h4" variant="h2" sx={{ mb: 2 }}>
        Actions Overview
      </Typography>
      <Grid
        container
        spacing={1}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {/* Stat Cards */}
        {statCards.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} />
          </Grid>
        ))}

        {/* Actions Closed Over Time Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <ActionsClosedOverTimeChart month={4} year={2024} />
        </Grid>

        {/* Severity Distribution Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <SeverityDistributionChart actionsData={vehicleDataItems} />
        </Grid>
      </Grid>

      {/* Details Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        {/* Data Grid Section */}
        <Grid item xs={12}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>

      {/* Footer */}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
