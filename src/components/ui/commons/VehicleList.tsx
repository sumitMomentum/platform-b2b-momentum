"use client";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import useVehicleStore from "@/states/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const VehicleList = () => {
  const setVehicles = useVehicleStore((state) => state.setVehicles);

  useEffect(() => {
    async function getVehicles() {
      const userVehiclesFromDB = await getUserVehicles();
      console.log(userVehiclesFromDB);
      setVehicles(userVehiclesFromDB);
      setSelectedVehicleId("");
    }
    getVehicles();
  }, []);

  const router = useRouter();
  const vehicles = useVehicleStore((state) => state.vehicles);
  console.log("vehicles", vehicles);
  const setSelectedVehicleId = useVehicleStore(
    (state) => state.setSelectedVehicleId
  );
  const selectedVehicleId = useVehicleStore((state) => state.selectedVehicleId);

  const handleClick = (
    vehicleId: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setSelectedVehicleId(vehicleId);
    router.push(`/home/vehicles/${vehicleId}`);
  };

  return vehicles.length != 0 ? (
    <div className="flex w-full flex-col">
      <div className="flex flex-wrap flex-col w-full">
        {vehicles.map((vehicle) => (
          <div
            className={`group p-4 flex items-center justify-between rounded text-sm text-gray-900 cursor-pointer ${
              selectedVehicleId === vehicle.id
                ? "text-white bg-gray-800 hover:bg-gray-100 hover:text-gray-900" // Apply black background if selected
                : "hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800"
            } px-2 p-2 gap-2`}
            key={vehicle.id}
            onClick={(event) => handleClick(vehicle.id, event)}
          >
            <div>{vehicle.make}</div>
            <div>{vehicle.model}</div>
            <div>{vehicle.vin}</div>
            <div>{vehicle.soc}%</div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <h1 className="flex justify-center items-center">Please add a vehicle</h1>
  );
};

export default VehicleList;
