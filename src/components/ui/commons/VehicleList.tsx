"use client";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import page from "@/app/[locale]/(landing)/page";
import useVehicleStore from "@/states/store";
import { useRouter } from "next/navigation";
import { type } from "os";
import { useEffect } from "react"; // Import only useEffect
import { DataGrid, GridEventListener } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { handleEvent } from "@/utils/facades/serverFacades/enodeFacade";
import { title } from "process";

const columns = [
  { field: "vin", headerName: "VIN", flex: 1 },
  { field: "make", headerName: "Make", flex: 1 },
  { field: "model", headerName: "Model", flex: 1 },
  {
    field: "soc",
    headerName: "SOC",
    // type: "number",
    flex: 1,
  },
];

const paginationModel = { page: 0, pageSize: 5 };

const VehicleList = () => {
  const router = useRouter();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const setSelectedVehicleId = useVehicleStore(
    (state) => state.setSelectedVehicleId
  );
  const selectedVehicleId = useVehicleStore((state) => state.selectedVehicleId);

  useEffect(() => {
    const getVehicles = async () => {
      // Make getVehicles async
      if (!vehicles || vehicles.length === 0) {
        const userVehiclesFromDB = await getUserVehicles();
        // console.log(userVehiclesFromDB);
        setVehicles(userVehiclesFromDB);
        setSelectedVehicleId(""); // Clear selected vehicle ID after fetching new data
      }
    };

    getVehicles(); // Call the async function
  }, [vehicles, setVehicles, setSelectedVehicleId]);

  const handleEvent: GridEventListener<"rowClick"> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details // GridCallbackDetails
  ) => {
    setSelectedVehicleId(params.row.vehicleId);
    router.push(`/home/vehicles/${params.row.vehicleId}`);
  };

  // <div className="flex w-full flex-col overflow-x-auto" id="vehicleTable">
  return (
    <Paper sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        onRowClick={handleEvent}
        getRowId={(row) => row.vehicleId}
        rows={vehicles}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
  // </div>;
};

export default VehicleList;

// const VehicleList = () => {
//   const router = useRouter();
//   const vehicles = useVehicleStore((state) => state.vehicles);
//   const setVehicles = useVehicleStore((state) => state.setVehicles);
//   const setSelectedVehicleId = useVehicleStore(
//     (state) => state.setSelectedVehicleId
//   );
//   const selectedVehicleId = useVehicleStore((state) => state.selectedVehicleId);

//   useEffect(() => {
//     const getVehicles = async () => {
//       // Make getVehicles async
//       if (!vehicles || vehicles.length === 0) {
//         const userVehiclesFromDB = await getUserVehicles();
//         // console.log(userVehiclesFromDB);
//         setVehicles(userVehiclesFromDB);
//         setSelectedVehicleId(""); // Clear selected vehicle ID after fetching new data
//       }
//     };

//     getVehicles(); // Call the async function
//   }, [vehicles, setVehicles, setSelectedVehicleId]);

//   const handleClick = (
//     vehicleId: string,
//     event: React.MouseEvent<HTMLDivElement>
//   ) => {
//     event.preventDefault();
//     setSelectedVehicleId(vehicleId);
//     router.push(`/home/vehicles/${vehicleId}`);
//   };

//   return vehicles.length !== 0 ? (
//     <div className="flex w-full flex-col overflow-x-auto" id="vehicleTable">
//       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//         <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
//           {" "}
//           {/* Make thead sticky */}
//           <tr>
//             <th
//               scope="col"
//               className="px-6
//  py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Make
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Model
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               {" "}
//               VIN
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               SoC
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700 max-h-[100px] overflow-y-scroll">
//           {vehicles.map((vehicle) => (
//             <tr
//               key={vehicle.vehicleId}
//               className={`hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
//                 selectedVehicleId === vehicle.vehicleId
//                   ? "bg-blue-100 dark:bg-blue-900"
//                   : ""
//               }`}
//               onClick={(event) => {
//                 console.log("Clicked vehicle:", vehicle.vehicleId);
//                 handleClick(vehicle.vehicleId, event);
//               }}
//             >
//               <td className="px-6 py-4 whitespace-nowrap">{vehicle.make}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{vehicle.model}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{vehicle.vin}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{vehicle.soc}%</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   ) : (
//     <h1 className="flex justify-center items-center">Please add a vehicle</h1>
//   );
// };
// return vehicles.length !== 0 ? (
//   <div className="flex w-full flex-col overflow-x-auto" id="vehicleTable">
//     <div className="flex flex-wrap flex-col w-full">
//       {" "}
//       {/* Make the inner div wrap content */}
//       {vehicles.map((vehicle) => (
//         <div
//           className={`group p-4 flex items-center justify-between rounded text-sm text-gray-900 cursor-pointer ${
//             selectedVehicleId === vehicle.id
//               ? "text-white bg-gray-800 hover:bg-gray-100 hover:text-gray-900"
//               : "hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800"
//           } px-2 p-2 gap-2 }`} // Apply whitespace-nowrap if overflowing
//           key={vehicle.id}
//           onClick={(event) => handleClick(vehicle.id, event)}
//         >
//           <div>{vehicle.make}</div>
//           <div>{vehicle.model}</div>
//           <div>{vehicle.vin}</div>
//           <div>{vehicle.soc}%</div>
//         </div>
//       ))}
//     </div>
//   </div>
// ) : (
//   <h1 className="flex justify-center items-center">Please add a vehicle</h1>
// );
