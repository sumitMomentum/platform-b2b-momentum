"use client";
import { getVehicleDashboardData } from "@/actions/admin/dashboardModule/get-vehicle-dashboard-data";
// import { createEnodeWebhook } from "@/actions/admin/dashboardModule/create-enode-webhook";
import InfoCard from "@/components/ui/dashboard/InfoCard";
import VehicleBatteryHealth from "@/components/ui/dashboard/VehicleBatteryHealth";
import VehicleChargePattern from "@/components/ui/dashboard/VehicleChargePattern";
import VehicleDetails from "@/components/ui/dashboard/VehicleDetails";
import VehicleUsage from "@/components/ui/dashboard/VehicleUsage";
import useVehicleStore from "@/states/store";
import {
  ArrowPathIcon,
  ArrowsPointingInIcon,
  ArrowTrendingDownIcon,
  LinkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect } from "react";

const VehicleDashboard = ({ params }: { params: { vehicleId: string } }) => {
  const vehicleId = params.vehicleId;
  // console.log("vehicle", vehicleId);
  const selectedVehicleId = useVehicleStore((state) => state.selectedVehicleId);
  // console.log("selectedVehicleId", selectedVehicleId);
  const vehiclesFromStore = useVehicleStore((state) => state.vehicles);

  // Find the selected vehicle based on selectedVehicleId
  const selectedVehicle = vehiclesFromStore.find(
    (vehicle) => vehicle.vehicleId === selectedVehicleId
  );
  // console.log("selectedVehicle", selectedVehicle);

  // State to store dashboardData
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVehicleDashboardData(vehicleId);
        setDashboardData(data); // Update state with the fetched 'data'
        console.log(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    dashboardData && (
      <div className="flex gap-6 w-full justify-center items-center">
        {selectedVehicle ? (
          <div className="flex w-full gap-6 flex-col">
            <div className="grid grid-cols-1 gap-6 w-full sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
              <InfoCard
                titleKey="Location"
                descriptionKey={dashboardData.location}
                icon={MapPinIcon}
              />
              {/* <InfoCard
                titleKey="Date Of Connection"
                descriptionKey={
                  selectedVehicle.dateOfConnection
                    ? new Date(
                        selectedVehicle.dateOfConnection
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"
                }
                icon={LinkIcon}
              /> */}
              <InfoCard
                titleKey="Data Points Collected"
                descriptionKey={dashboardData.dataPointsCollected}
                icon={ArrowsPointingInIcon}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 w-full sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
              {/* <VehicleDetails
                year={selectedVehicle.year}
                model={selectedVehicle.model}
                make={selectedVehicle.make}
                vin={selectedVehicle.vin}
                batteryCapacity={selectedVehicle.batteryCapacity}
                odometer={selectedVehicle.odometer}
              /> */}
              <VehicleDetails
                year={dashboardData["year "]}
                model={dashboardData.model}
                make={dashboardData.make}
                vin={dashboardData.vin}
                batteryCapacity={dashboardData.batteryCapacity}
                odometer={dashboardData.odometerFloat}
              />
              <VehicleChargePattern
                soc={selectedVehicle.soc || 0}
                totalEnergyConsumed={dashboardData.totalEnergyConsumed}
                averageSoC={dashboardData.batteryHealthAverageSoC}
                connectorType={dashboardData.connectorType}
                totalChargingSessions={dashboardData.totalChargingSession}
                averageChargingRate={dashboardData.averageChargingRate}
                dashboardData={dashboardData}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 w-full sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
              <VehicleUsage
                avgDailyKmDriven={dashboardData.avgDailyKmDriven}
                temperatureLow={dashboardData.temperatureLow}
                temperatureHigh={dashboardData.temperatureHigh}
                socRangeMin={dashboardData.socRangeMin}
                socRangeMax={dashboardData.socRangeMax}
                rangeObservedMin={dashboardData.rangeObservedMin}
                rangeObservedMax={dashboardData.rangeObservedMax}
                realRangeObserved={dashboardData.realRangeObserved}
                epaProvidedRange={dashboardData.epawltpProvidedRange}
                dashboardData={dashboardData}
              />
              <VehicleBatteryHealth
                batteryHealthSoH={dashboardData.batteryHealthSoH}
                estimatedDegradation={dashboardData.estimatedDegradation}
                batteryChemistry={dashboardData.batteryChemistry}
                dashboardData={dashboardData}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 w-full sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
              <InfoCard
                titleKey="End Of Life"
                // descriptionKey={dashboardData.endOfLife.toLocaleDateString(
                //   "en-US",
                //   { month: "short", day: "2-digit", year: "numeric" }
                // )}
                descriptionKey={dashboardData.endOfLife}
                icon={ArrowTrendingDownIcon}
              />
              <InfoCard
                titleKey="Remaining Useful Life"
                descriptionKey={dashboardData.remainingUsefulLife}
                icon={ArrowPathIcon}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            Please select a vehicle
          </div>
        )}
      </div>
    )
  );
};

export default VehicleDashboard;
