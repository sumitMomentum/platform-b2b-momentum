//@ts-nocheck
"use client";

import Card from "@/components/ui/commons/Card";
import React, { useEffect } from "react";
// import { useTranslations } from "next-intl";
import BatteryHealthChart from "./BatteryHealthChart";
import useVehicleStore from "@/states/store";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import { Container } from "@mui/material";

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
              const sohValue = parseInt(vehicle["soh"]) || 0; // Handle undefined and empty values
              return total + sohValue;
            }, 0) / vehicles.length
          ) // Use the actual length of vehicles
            .toFixed(2)
        : "N/A"; // Fallback for when data is not loaded

    const avgDegradation =
      vehicles && vehicles.length > 0
        ? (
            100 -
            vehicles.reduce((total, vehicle) => {
              const sohValue = parseInt(vehicle["soh"]) || 0;
              return total + sohValue;
            }, 0) /
              vehicles.length
          ).toFixed(2)
        : "N/A"; // Fallback for when data is not loaded

    setLoading(false);
  }, []);

  // Safely handle the calculations by checking if vehicles exist

  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>Battery Health of Fleet</Card.Title>
        </Card.Header>
        <Container
          sx={{ display: "flex", justifyContent: "center", border: 0.5, mb: 2 }}
        >
          <BatteryHealthChart />
        </Container>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <Card.Description>Avg SoH</Card.Description>
            <Card.Description>{avgSoH} %</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>Avg Estimated Degradation</Card.Description>
            <Card.Description>{avgDegradation} %</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>Total Vehicles</Card.Description>
            <Card.Description>{vehicles.length || 0}</Card.Description>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BatteryHealth;
