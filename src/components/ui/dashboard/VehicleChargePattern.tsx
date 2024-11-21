import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import SocChart from "./SocChart";
import { useTranslations } from "next-intl";

const VehicleChargePattern = ({ dashboardData }) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" component="div">
            {t("chargingPattern")}
          </Typography>
        }
      />
      <CardContent>
        {/* First Row */}
        <Box textAlign="center" p={2} borderRadius={1}>
          <Typography variant="subtitle2">
            {t("totalEnergyConsumed")}
          </Typography>
          <Typography variant="h6">
            {dashboardData.totalEnergyConsumed} kW
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* First Column */}
          <Grid
            item
            xs={12}
            lg={4}
            container
            direction="column"
            justifyContent="space-around"
          >
            <Box>
              <Typography variant="subtitle2">{t("averageSoc")}</Typography>
              <Typography>{dashboardData.batteryHealthAverageSoC}%</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">{t("connectorType")}</Typography>
              <Typography>
                {dashboardData.connectorType === "Public Slow" ? "GBT" : "CCS2"}
              </Typography>
            </Box>
          </Grid>

          {/* Center Chart */}
          <Grid item xs={12} lg={4}>
            <Box display="flex" justifyContent="center">
              <SocChart soc={dashboardData.soc} />
            </Box>
          </Grid>

          {/* Third Column */}
          <Grid
            item
            xs={12}
            lg={4}
            container
            direction="column"
            justifyContent="space-around"
            alignItems="flex-end"
          >
            <Box textAlign="right">
              <Typography variant="subtitle2">
                {t("totalChargingSessions")}
              </Typography>
              <Typography>{dashboardData.totalChargingSession}</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="subtitle2">
                {t("averageChargingRate")}
              </Typography>
              <Typography>
                {dashboardData.connectorType === "Public Slow"
                  ? 7.8
                  : dashboardData.make === "Audi "
                  ? 60
                  : 22}{" "}
                kW
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VehicleChargePattern;
