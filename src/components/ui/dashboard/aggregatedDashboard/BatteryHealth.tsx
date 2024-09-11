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
  // const t = useTranslations();
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
            <Card.Description>
              {" "}
              {(
                vehicles.reduce((total, vehicle) => {
                  return (total = total + parseInt(vehicle["soh "]));
                }, 0) / 12
              ).toFixed(2)}{" "}
              %
            </Card.Description>
            {/* <Card.Description>100%</Card.Description> */}
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>Avg Estimated Degradation</Card.Description>
            <Card.Description>
              {/* {// Initialize an array to store monthly sums
              (
                Array.from({ length: 12 }, () => 0)
                  .map((_, monthIndex) =>
                    // Sum degradation for each month across all vehicles
                    vehicles.reduce((monthSum, vehicle) => {
                      const degradationValue =
                        parseFloat(
                          vehicle["BatteryHealthAverageEstimatedDegradation"][
                            monthIndex
                          ]
                        ) || 0;
                      return monthSum + degradationValue;
                    }, 0)
                  )
                  // Calculate overall average from the monthly sums
                  .reduce((total, monthSum) => total + monthSum, 0) / (12*vehicles.length)
              ).toFixed(2)} */}
              {100 -
                (
                  vehicles.reduce((total, vehicle) => {
                    return (total = total + parseInt(vehicle["soh "]));
                  }, 0) / 12
                ).toFixed(2)}
              %
            </Card.Description>
            {/* <Card.Description>0.00 %</Card.Description> */}
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>Total Vehicles</Card.Description>
            <Card.Description>{vehicles.length}</Card.Description>
            {/* <Card.Description>300</Card.Description> */}
          </div>
        </div>
        <div className="flex justify-between">
          {/* <div className="flex flex-col justify-evenly">
            <Card.Description>{t('')}</Card.Description>
            <Card.Description>{t('300')}</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>{t('Battery Condition')}</Card.Description>
            <Card.Description>{t('')}</Card.Description>
          </div> */}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BatteryHealth;
