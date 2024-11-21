import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";

const VehicleDetails = ({ dashboardData }) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  return (
    <Card>
      <CardHeader title={t("vehicleInformation")} sx={{ margin: 2 }} />
      <CardContent sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body1">
            <strong>{t("odometer")}:</strong> {dashboardData.odometerFloat}
          </Typography>
          <Typography variant="body1">
            <strong>{t("manufacturer")}:</strong> {dashboardData.make}
          </Typography>
          <Typography variant="body1">
            <strong>{t("vehicleModel")}:</strong> {dashboardData.model}
          </Typography>
          <Typography variant="body1">
            <strong>{t("modelYear")}:</strong> {dashboardData.year}
          </Typography>
          <Typography variant="body1">
            <strong>{t("vin")}:</strong> {dashboardData.vin}
          </Typography>
          <Typography variant="body1">
            <strong>{t("batteryCapacity")}:</strong>{" "}
            {dashboardData.batteryCapacity} kWh
          </Typography>
          <Typography variant="body1">
            <strong>End Of Life:</strong> {dashboardData.endOfLife}
          </Typography>

          <Typography variant="body1">
            <strong>Remaining Useful Life:</strong>{" "}
            {dashboardData.remainingUsefulLife}
          </Typography>
          <Typography variant="body1">
            <strong>Data Points Collected:</strong>{" "}
            {dashboardData.dataPointsCollected}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {dashboardData.location}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleDetails;
