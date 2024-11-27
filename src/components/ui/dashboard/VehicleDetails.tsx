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

const VehicleDetails = ({ dashboardData }) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  return (
    <Card>
      <CardHeader title={t("vehicleInformation")} sx={{ margin: 2 }} />
      <CardContent sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          {/* First Section */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body1">
                <strong>
                  {" "}
                  <FactoryIcon color="primary" /> {t("manufacturer")}:
                </strong>{" "}
                {dashboardData.make}
              </Typography>
              <Typography variant="body1">
                <strong>
                  {" "}
                  <DirectionsCarIcon color="primary" /> {t("vehicleModel")}:
                </strong>{" "}
                {dashboardData.model}
              </Typography>
              <Typography variant="body1">
                <strong>
                  {" "}
                  <EventIcon color="primary" /> {t("modelYear")}:
                </strong>{" "}
                {dashboardData.year}
              </Typography>
              <Typography variant="body1">
                <strong>
                  {" "}
                  <BadgeIcon color="primary" /> {t("vin")}:
                </strong>{" "}
                {dashboardData.vin}
              </Typography>
            </Box>
          </Grid>

          {/* Second Section */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body1">
                <strong>
                  {" "}
                  <SpeedIcon color="primary" /> {t("odometer")}:
                </strong>{" "}
                {dashboardData.odometerFloat}
              </Typography>
              <Typography variant="body1">
                <strong>
                  <BatteryUnknownIcon color="primary" /> {t("batteryCapacity")}:
                </strong>{" "}
                {dashboardData.batteryCapacity} kWh
              </Typography>
              <Typography variant="body1">
                <strong>
                  {" "}
                  <BatteryAlertIcon color="primary" /> End Of Life:
                </strong>{" "}
                {dashboardData.endOfLife}
              </Typography>
              <Typography variant="body1">
                <strong>
                  {" "}
                  <BatterySaverIcon color="primary" /> Remaining Useful Life:
                </strong>{" "}
                {dashboardData.remainingUsefulLife}
              </Typography>
              <Typography variant="body1">
                <strong>
                  {" "}
                  <ScatterPlotIcon color="primary" />
                  Data Points Collected: :
                </strong>{" "}
                {dashboardData.dataPointsCollected}
              </Typography>
              <Typography variant="body1">
                <strong>
                  {" "}
                  <LocationOnIcon color="primary" />
                  Location:
                </strong>{" "}
                {dashboardData.location}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VehicleDetails;
