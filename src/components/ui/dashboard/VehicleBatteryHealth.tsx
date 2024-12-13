import { useTranslations } from "next-intl";
import SohChart from "./SohChart";
import {
  Box,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Card,
  Container,
} from "@mui/material";
import React from "react";

const VehicleBatteryHealth = ({ dashboardData }) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  return (
    <Card>
      <CardHeader title="Battery Health of Fleet" sx={{ margin: 2 }} />
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <SohChart dashboardData={dashboardData} />
        </Box>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              {t("soh")}
            </Typography>
            <Typography>{`${dashboardData.batteryHealthSoH}%`} %</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              {t("estimatedDegradation")}
            </Typography>
            <Typography>
              {`${dashboardData.batteryHealthDegradation}%`} %
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              {t("batteryChemistry")}
            </Typography>
            <Typography>{dashboardData.batteryChemistry}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VehicleBatteryHealth;
