"use client";
import { getVehicleDashboardData } from "@/actions/admin/dashboardModule/get-vehicle-dashboard-data";
import VehicleBatteryHealth from "@/components/ui/dashboard/VehicleBatteryHealth";
import VehicleChargePattern from "@/components/ui/dashboard/VehicleChargePattern";
import VehicleDetails from "@/components/ui/dashboard/VehicleDetails";
import VehicleUsage from "@/components/ui/dashboard/VehicleUsage";
import useVehicleStore from "@/states/store";

import { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import PageName from "@/components/ui/commons/PageName";

const VehicleDashboard = (props: {
  params: Promise<{ vehicleId: string }>;
}) => {
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const selectedVehicleId = useVehicleStore((state) => state.selectedVehicleId);
  const vehiclesFromStore = useVehicleStore((state) => state.vehicles);

  // Find the selected vehicle based on selectedVehicleId
  const selectedVehicle = vehiclesFromStore.find(
    (vehicle) => vehicle.vehicleId === selectedVehicleId
  );

  // State to store dashboardData
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await props.params; // Await the promise here
      setVehicleId(resolvedParams.vehicleId); // Set the vehicleId state
    };
    fetchData();
  }, [props.params]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (vehicleId) {
          const data = await getVehicleDashboardData(vehicleId);
          setDashboardData(data); // Update state with the fetched 'data'
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [vehicleId]); // Add vehicleId as a dependency

  return (
    dashboardData && (
      <Box>
        <div className="w-full">
          <PageName
            name={selectedVehicle ? vehicleId : ""}
            breadcrumbs={[
              { name: "Home", href: "/home" },
              { name: "Vehicles", href: "/home/vehicles/list" },
            ]}
          />
        </div>

        <Box
          sx={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            width: "100%",
          }}
        >
          {selectedVehicle ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Grid container spacing={6} sx={{ width: "100%" }}>
                <Grid item xs={12} md={12} lg={6}>
                  <VehicleDetails dashboardData={dashboardData} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  <VehicleChargePattern dashboardData={dashboardData} />
                </Grid>
              </Grid>
              <Grid container spacing={6} sx={{ width: "100%" }}>
                <Grid item xs={12} md={12} lg={6}>
                  <VehicleUsage dashboardData={dashboardData} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  <VehicleBatteryHealth dashboardData={dashboardData} />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography>Please select a vehicle</Typography>
            </Box>
          )}
        </Box>
      </Box>
    )
  );
};

export default VehicleDashboard;
