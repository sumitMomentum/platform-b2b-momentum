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
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { transform } from "next/dist/build/swc";
import { split } from "postcss/lib/list";
import { text } from "stream/consumers";
import { map } from "svix/dist/openapi/rxjsStub";

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
            md={4}
            lg={4}
            container
            sx={{
              flexDirection: { xs: "row", md: "column" }, // Row on small screens, column on medium and above
            }}
            justifyContent="space-around"
          >
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {t("averageSoc")}
              </Typography>
              <Typography>{dashboardData.batteryHealthAverageSoC}%</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {t("connectorType")}
              </Typography>
              <Typography>
                {dashboardData.connectorType === "Public Slow" ? "GBT" : "CCS2"}
              </Typography>
            </Box>
          </Grid>

          {/* Center Chart */}
          <Grid
            item
            container
            xs={12}
            md={4}
            lg={4}
            sx={{
              height: { xs: 250, md: 300 }, // Responsive height
            }}
          >
            <Gauge
              value={dashboardData.soc}
              // width={width}
              // height={height}
              startAngle={0}
              endAngle={360}
              innerRadius="70%"
              outerRadius="100%"
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  transform: "translate(0px, 0px)",
                  fontSize: "1.5rem",
                  textAlign: "center",
                  lineHeight: "1.2",
                },
              }}
              text={({ value }) => `${value}%`} // Add line breaks in text
            />
          </Grid>

          {/* Third Column */}
          <Grid
            item
            xs={12}
            md={4}
            lg={4}
            container
            sx={{
              flexDirection: { xs: "row", md: "column" }, // Row on small screens, column on medium and above
              textAlign: { xs: "left", md: "right" },
              justifyContent: "space-around",
              alignItems: "flex-end",
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {t("totalChargingSessions")}
              </Typography>
              <Typography>{dashboardData.totalChargingSession}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
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
