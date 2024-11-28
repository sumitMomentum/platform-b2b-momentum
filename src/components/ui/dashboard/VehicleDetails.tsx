import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import BadgeIcon from "@mui/icons-material/Badge";
import FactoryIcon from "@mui/icons-material/Factory";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventIcon from "@mui/icons-material/Event";
import SpeedIcon from "@mui/icons-material/Speed";
import BatteryUnknownIcon from "@mui/icons-material/BatteryUnknown";
import BatterySaverIcon from "@mui/icons-material/BatterySaver";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import { title } from "process";
import { map } from "svix/dist/openapi/rxjsStub";
import style from "styled-jsx/style";

const VehicleDetails = ({ dashboardData }) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  const firstSectionData = [
    {
      icon: <FactoryIcon color="primary" fontSize="medium" />,
      label: t("manufacturer"),
      value: dashboardData.make,
    },
    {
      icon: <DirectionsCarIcon color="primary" fontSize="medium" />,
      label: t("vehicleModel"),
      value: dashboardData.model,
    },
    {
      icon: <EventIcon color="primary" fontSize="medium" />,
      label: t("modelYear"),
      value: dashboardData.year,
    },
    {
      icon: <BadgeIcon color="primary" fontSize="medium" />,
      label: t("vin"),
      value: dashboardData.vin,
    },
  ];

  const secondSectionData = [
    {
      icon: <SpeedIcon color="primary" fontSize="medium" />,
      label: t("odometer"),
      value: dashboardData.odometerFloat,
    },
    {
      icon: <BatteryUnknownIcon color="primary" fontSize="medium" />,
      label: t("batteryCapacity"),
      value: `${dashboardData.batteryCapacity} kWh`,
    },
    {
      icon: <BatteryAlertIcon color="primary" fontSize="medium" />,
      label: "End Of Life",
      value: dashboardData.endOfLife,
    },
    {
      icon: <BatterySaverIcon color="primary" fontSize="medium" />,
      label: "Remaining Useful Life",
      value: dashboardData.remainingUsefulLife,
    },
    {
      icon: <ScatterPlotIcon color="primary" fontSize="medium" />,
      label: "Data Points Collected",
      value: dashboardData.dataPointsCollected,
    },
    {
      icon: <LocationOnIcon color="primary" fontSize="medium" />,
      label: "Location",
      value: dashboardData.location,
    },
  ];

  return (
    <Card>
      <CardHeader title={t("vehicleInformation")} sx={{ margin: 2 }} />
      <CardContent sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          {/* First Section */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {firstSectionData.map((item, index) => (
                <Typography variant="body1" key={index}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {item.icon}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <strong style={{ marginLeft: 8 }}>{item.label} : </strong>
                      {item.value}
                    </Box>
                  </Box>
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Second Section */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {secondSectionData.map((item, index) => (
                <Typography variant="body1" key={index}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {item.icon}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <strong style={{ marginLeft: 8 }}>{item.label}:</strong>
                      {item.value}
                    </Box>
                  </Box>
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VehicleDetails;
