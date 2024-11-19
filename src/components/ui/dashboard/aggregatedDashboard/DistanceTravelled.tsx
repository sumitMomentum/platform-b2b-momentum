//@ts-nocheck
"use client";

import Card from "@/components/ui/commons/Card";
// import { useTranslations } from "next-intl";
import DistanceTravelledChart from "./DistanceTravelledChart";
import useVehicleStore from "@/states/store";
import { useRouter } from "next/navigation";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import { useEffect } from "react";
import {
  Box,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Description } from "@radix-ui/themes/dist/esm/components/alert-dialog.js";
import { split } from "postcss/lib/list";
import { title } from "process";

const DistanceTravelled = () => {
  const vehicles = useVehicleStore((state) => state.vehicles);

  return (
    <Card>
      <CardHeader title="Usage Details of Fleet" sx={{ margin: 2 }} />
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <DistanceTravelledChart />
        </Box>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={4}>
            <Typography variant="bold">Avg Monthly Km Driven</Typography>
            <Typography>
              {(
                vehicles.reduce((totalDistance, vehicle) => {
                  return totalDistance + vehicle.averageMonthlyUsage;
                }, 0) /
                (vehicles.length * 12)
              ).toFixed(2)}{" "}
              kms
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="bold">Temperature Low/High</Typography>
            <Typography>{`${(
              vehicles.reduce((total, vehicle) => {
                return total + vehicle.usageTemperatureLow;
              }, 0) / 12
            ).toFixed(2)}\u00B0C / ${(
              vehicles.reduce((total, vehicle) => {
                return total + vehicle.usageTemperatureHigh;
              }, 0) / 12
            ).toFixed(2)}\u00B0C`}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="bold">SOC Range</Typography>
            <Typography>
              {(
                vehicles.reduce((total, vehicle) => {
                  return total + vehicle.usageSoCRangeMin;
                }, 0) / 12
              ).toFixed(2)}
              {"% / "}
              {(
                vehicles.reduce((total, vehicle) => {
                  return total + vehicle.usageSoCRangeMax;
                }, 0) / 12
              ).toFixed(2)}{" "}
              %
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="bold">Range Observed Min/Max</Typography>
            <Typography>
              {(
                vehicles.reduce((total, vehicle) => {
                  return total + vehicle.usageRangeObservedMin;
                }, 0) / 12
              ).toFixed(2)}{" "}
              {"kms / "}
              {(
                vehicles.reduce((total, vehicle) => {
                  return total + vehicle.usageRangeObservedMax;
                }, 0) / 12
              ).toFixed(2)}
              {" kms"}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="bold">Avg Real Range Observed</Typography>
            <Typography>
              {(
                vehicles.reduce((total, vehicle) => {
                  return total + vehicle.realRangeObserved;
                }, 0) / 12
              ).toFixed(2)}{" "}
              kms
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="bold">Average WLTP est. range</Typography>
            <Typography>277 kms</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DistanceTravelled;
