import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import Card from "@/components/ui/commons/Card";
import useVehicleStore from "@/states/store";
import React from "react";

const VehicleStatus =  () => {
  const vehicles = useVehicleStore((state) => state.vehicles);
  // const vehicles = await getUserVehicles();

  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>Vehicle Status</Card.Title>
        </Card.Header>
        <div className="flex flex-col gap-6 border p-6">
          {/* Active */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <Card.Description>Active</Card.Description>
            <div className="ml-auto bg-green-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
              {/* Wrap the reduce result in curly braces */}
              {vehicles.reduce((count, vehicle) => {
                if (vehicle.status === "Active") {
                  return count + 1;
                } else {
                  return count;
                }
              }, 0)}
            </div>
          </div>
          {/* Inactive */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <Card.Description>In-active</Card.Description>
            <div className="ml-auto bg-red-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
              {/* Wrap the reduce result in curly braces */}
              {vehicles.reduce((count, vehicle) => {
                if (vehicle.status === "Inactive") {
                  return count + 1;
                } else {
                  return count;
                }
              }, 0)}
            </div>
          </div>
          {/* Charging */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <Card.Description>Charging</Card.Description>
            <div className="ml-auto bg-yellow-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
              {/* Wrap the reduce result in curly braces */}
              {vehicles.reduce((count, vehicle) => {
                if (vehicle.status === "Charging") {
                  return count + 1;
                } else {
                  return count;
                }
              }, 0)}
            </div>
          </div>
          {/* Out of Service */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
            <Card.Description>Out-Of-Service</Card.Description>
            <div className="ml-auto bg-gray-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
              {/* Wrap the reduce result in curly braces */}
              {vehicles.reduce((count, vehicle) => {
                if (vehicle.status === "Out of Service") {
                  return count + 1;
                } else {
                  return count;
                }
              }, 0)}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleStatus;

// "use client";

// import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
// import Card from "@/components/ui/commons/Card";
// import React, { useEffect, useState } from "react";

// const VehicleStatus = async () => {
//   const [conditions, setconditions] = useState({
//     active: 0,
//     inactive: 0,
//     charging: 0,
//     outofservice: 0,
//   });

//   useEffect(() => {
//     async () => {
//       const vehicles = await getUserVehicles();

//       setconditions({
//         active: vehicles.reduce((count, vehicle) => {
//           return vehicle.vehicleStatus === "Active" ? count + 1 : count;
//         }, 0),
//         inactive: vehicles.reduce((count, vehicle) => {
//           return vehicle.vehicleStatus === "Inactive" ? count + 1 : count;
//         }, 0),
//         charging: vehicles.reduce((count, vehicle) => {
//           return vehicle.vehicleStatus === "Charging" ? count + 1 : count;
//         }, 0),
//         outofservice: vehicles.reduce((count, vehicle) => {
//           return vehicle.vehicleStatus === "Out-of-Service" ? count + 1 : count;
//         }, 0),
//       });
//     };
//   }, []);
//   const vehicles = await getUserVehicles();

//   return (
//     <Card>
//       <Card.Body>
//         <Card.Header>
//           <Card.Title>Vehicle Status</Card.Title>
//         </Card.Header>
//         <div className="flex flex-col gap-6 border p-6">
//           {/* Active */}
//           <div className="flex items-center">
//             <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
//             <Card.Description>Active</Card.Description>
//             <div className="ml-auto bg-green-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
//               {conditions.active}
//             </div>
//           </div>
//           {/* Inactive */}
//           <div className="flex items-center">
//             <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
//             <Card.Description>In-active</Card.Description>
//             <div className="ml-auto bg-red-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
//               {conditions.inactive}
//             </div>
//           </div>
//           {/* Charging */}
//           <div className="flex items-center">
//             <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
//             <Card.Description>Charging</Card.Description>
//             <div className="ml-auto bg-yellow-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
//               {conditions.inactive}
//             </div>
//           </div>
//           {/* Out of Service */}
//           <div className="flex items-center">
//             <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
//             <Card.Description>Out-Of-Service</Card.Description>
//             <div className="ml-auto bg-gray-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
//               {conditions.outofservice}
//             </div>
//           </div>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// };

// export default VehicleStatus;
