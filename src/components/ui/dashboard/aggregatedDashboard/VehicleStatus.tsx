import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useVehicleStore from "@/states/store";
import React from "react";
import { Stack, Chip } from "@mui/material";
import { title } from "process";
import { map } from "svix/dist/openapi/rxjsStub";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ChargingStationIcon from "@mui/icons-material/ChargingStation";
import InfoIcon from "@mui/icons-material/Info";
const VehicleStatus = () => {
  const vehicles = useVehicleStore((state) => state.vehicles);

  const statuses: {
    label: string;
    color:
      | "success"
      | "error"
      | "warning"
      | "default"
      | "primary"
      | "secondary"
      | "info";
    status: string;
  }[] = [
    { label: "Active", color: "success", status: "Active" },
    { label: "Inactive", color: "error", status: "Inactive" },
    { label: "Charging", color: "warning", status: "Charging" },
    { label: "Out Of Service", color: "info", status: "Out of Service" }, // Changed "grey" to "default"
  ];

  return (
    <Card>
      <CardHeader
        title="Vehicle Status"
        gutterBottom
        sx={{ marginBottom: 3, margin: 2 }}
      />
      <CardContent>
        <Stack spacing={3} p={2}>
          {statuses.map(({ label, color, status }) => (
            <Stack key={status} direction="row" alignItems="center">
              <Chip
                variant="outlined"
                label={label}
                color={color}
                icon={
                  label === "Active" ? (
                    <ToggleOnIcon />
                  ) : label === "Charging" ? (
                    <ChargingStationIcon />
                  ) : label === "Inactive" ? (
                    <ToggleOffIcon />
                  ) : (
                    <InfoIcon />
                  )
                }
              />
              <Chip
                label={vehicles.reduce(
                  (count, vehicle) =>
                    vehicle.status === status ? count + 1 : count,
                  0
                )}
                color={color}
                variant="outlined"
                sx={{ marginLeft: "auto" }} // Aligns the count chip to the right
              />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VehicleStatus;
