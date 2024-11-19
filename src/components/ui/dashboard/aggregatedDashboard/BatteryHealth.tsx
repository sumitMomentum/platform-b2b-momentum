//@ts-nocheck
"use client";

import Card from "@/components/ui/commons/Card";

import React, { useEffect } from "react";
import BatteryHealthChart from "./BatteryHealthChart";
import useVehicleStore from "@/states/store";
import { Box, CardContent, CardHeader, Grid, Typography } from "@mui/material";

const BatteryHealth = () => {
  const [loading, setLoading] = React.useState(true);
  const [avgSoH, setavgSoH] = React.useState(0);

  const [avgDegradation, setavgDegradation] = React.useState(0);

  const vehicles = useVehicleStore((state) => state.vehicles);

  useEffect(() => {
    const avgSoH =
      vehicles && vehicles.length > 0
        ? (
            vehicles.reduce((total, vehicle) => {
              const sohArray = vehicle["soh"]; // Assuming soh is an array
              const lastSoHValue =
                sohArray && sohArray.length > 0
                  ? sohArray[sohArray.length - 1]
                  : 0; // Get the last value or 0 if not available
              return total + (parseInt(lastSoHValue) || 0); // Handle undefined and empty values
            }, 0) / vehicles.length
          ).toFixed(2)
        : "N/A"; // Fallback for when data is not loaded

    const avgDegradation =
      vehicles && vehicles.length > 0
        ? (100 - parseFloat(avgSoH)) // Calculate degradation based on the average SoH
            .toFixed(2)
        : "N/A"; // Fallback for when data is not loaded

    setavgSoH(avgSoH);
    setavgDegradation(avgDegradation);
    setLoading(false);
  }, [vehicles]);

  return (
    <Card>
      <CardHeader title="Battery Health of Fleet" sx={{ margin: 2 }} />
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <BatteryHealthChart />
        </Box>

        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={4}>
            <Typography variant="bold">Avg SoH</Typography>
            <Typography>{avgSoH} %</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="bold">Avg Estimated Degradation</Typography>
            <Typography>{avgDegradation} %</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="bold">Total Vehicles</Typography>
            <Typography>{vehicles.length || 0}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BatteryHealth;
