//@ts-nocheck
"use client";

import Card from "@/components/ui/commons/Card";
// import { useTranslations } from "next-intl";
import DistanceTravelledChart from "./DistanceTravelledChart";
import useVehicleStore from "@/states/store";
import { useRouter } from "next/navigation";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import { useEffect } from "react";
import { Box, Container } from "@mui/material";
import { Description } from "@radix-ui/themes/dist/esm/components/alert-dialog.js";
import { split } from "postcss/lib/list";

const DistanceTravelled = () => {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);

  useEffect(() => {
    const getVehicles = async () => {
      // Make getVehicles async
      if (!vehicles || vehicles.length === 0) {
        const userVehiclesFromDB = await getUserVehicles();
        // console.log(userVehiclesFromDB);
        setVehicles(userVehiclesFromDB);
      }
    };

    getVehicles(); // Call the async function
  }, [vehicles, setVehicles]);

  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>Usage Details of Fleet</Card.Title>
        </Card.Header>
        <Container
          sx={{ display: "flex", justifyContent: "center", border: 0.5, mb: 2 }}
        >
          <DistanceTravelledChart />
        </Container>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>Avg Monthly Km Driven</Card.Description>
              <Card.Description>
                {(
                  vehicles.reduce((totalDistance, vehicle) => {
                    // Ensure vehicle.monthlyUsage exists and is an array
                    const monthlyUsage = vehicle.MonthlyUsage || [];

                    // Sum the distances for this vehicle
                    const vehicleTotalDistance = monthlyUsage.reduce(
                      (sum, distanceStr) => {
                        const distance = parseFloat(distanceStr) || 0; // Handle potential parsing errors
                        return sum + distance;
                      },
                      0
                    );

                    return totalDistance + vehicleTotalDistance;
                  }, 0) /
                  (vehicles.length * 12)
                ).toFixed(2)}{" "}
                kms
              </Card.Description>
              {/* <Card.Description>78 km</Card.Description> */}
            </div>
            <div>
              <Card.Description>Temperature Low/High</Card.Description>
              <Card.Description>{`${(
                vehicles.reduce((total, vehicle) => {
                  const temperatureStr = vehicle.UsageTemperatureLowHigh || ""; // Ensure the string exists
                  const [low] = temperatureStr.split("/") || [];
                  return total + (parseInt(low) || 0); // Handle undefined or invalid values
                }, 0) / 12
              ).toFixed(2)}\u00B0C / ${(
                vehicles.reduce((total, vehicle) => {
                  const temperatureStr = vehicle.UsageTemperatureLowHigh || ""; // Ensure the string exists
                  const [, high] = temperatureStr.split("/") || [];
                  return total + (parseInt(high) || 0); // Handle undefined or invalid values
                }, 0) / 12
              ).toFixed(2)}\u00B0C`}</Card.Description>
              {/* <Card.Description>{`28\u00B0C / 34\u00B0C`}</Card.Description> */}
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>SOC Range</Card.Description>
              <Card.Description>
                {(
                  vehicles.reduce((total, vehicle) => {
                    const socRangeStr = vehicle.UsageSoCRange || ""; // Ensure the string exists
                    const [low] = socRangeStr.split("/") || [];
                    return total + (parseInt(low) || 0); // Handle undefined or invalid values
                  }, 0) / 12
                ).toFixed(2)}
                {"% / "}
                {(
                  vehicles.reduce((total, vehicle) => {
                    const socRangeStr = vehicle.UsageSoCRange || ""; // Ensure the string exists
                    const [, high] = socRangeStr.split("/") || [];
                    return total + (parseInt(high) || 0); // Handle undefined or invalid values
                  }, 0) / 12
                ).toFixed(2)}{" "}
                %
              </Card.Description>
              {/* <Card.Description>30% - 95%</Card.Description> */}
            </div>
            <div>
              <Card.Description>Range Observed Min/Max</Card.Description>
              <Card.Description>
                {(
                  vehicles.reduce((total, vehicle) => {
                    const rangeObservedStr =
                      vehicle.UsageRangeObservedMinMax || ""; // Ensure the string exists
                    const [min] = rangeObservedStr.split("/") || [];
                    return total + (parseInt(min) || 0); // Handle undefined or invalid values
                  }, 0) / 12
                ).toFixed(2)}{" "}
                {" / "}
                {(
                  vehicles.reduce((total, vehicle) => {
                    const rangeObservedStr =
                      vehicle.UsageRangeObservedMinMax || ""; // Ensure the string exists
                    const [, max] = rangeObservedStr.split("/") || [];
                    return total + (parseInt(max) || 0); // Handle undefined or invalid values
                  }, 0) / 12
                ).toFixed(2)}{" "}
              </Card.Description>
              {/* <Card.Description>87 km / 110 km</Card.Description> */}
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>Avg Real Range Observed</Card.Description>
              <Card.Description>
                {(
                  vehicles.reduce((total, vehicle) => {
                    const observedRangeStr =
                      vehicle.UsageObservedvsEPAWLTPProvided || ""; // Ensure the string exists
                    const [observed] = observedRangeStr.split("/") || [];
                    return total + (parseInt(observed) || 0); // Handle undefined or invalid values
                  }, 0) / 12
                ).toFixed(2)}{" "}
                kms
              </Card.Description>
              {/* <Card.Description>90 km</Card.Description> */}
            </div>
            <div>
              <Card.Description>Average WLTP est. range</Card.Description>
              {/* <Card.Description>
                {(
                  vehicles.reduce((total, vehicle) => {
                    const wltpRangeStr = vehicle.UsageObservedvsEPAWLTPProvided || ""; // Ensure the string exists
                    const [, wltp] = wltpRangeStr.split("/") || [];
                    return total + (parseInt(wltp) || 0); // Handle undefined or invalid values
                  }, 0) / 12
                ).toFixed(2)}{" "}
                kms
              </Card.Description> */}
              <Card.Description>210-277 kms</Card.Description>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DistanceTravelled;
