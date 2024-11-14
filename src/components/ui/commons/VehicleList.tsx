"use client";
import useVehicleStore from "@/states/store";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react"; // Import only useEffect
import { DataGrid, GridEventListener } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
// import { allVehicleDataLoadingContext } from "@/app/[locale]/(admin)/home/page";

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

const paginationModel = { page: 0, pageSize: 10 };

const VehicleList = (props) => {
  const router = useRouter();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const setSelectedVehicleId = useVehicleStore(
    (state) => state.setSelectedVehicleId
  );

  //  const { loading, startLoading, stopLoading } = useContext(allVehicleDataLoadingContext);

  const handleRowClickEvent: GridEventListener<"rowClick"> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details // GridCallbackDetails
  ) => {
    setSelectedVehicleId(params.row.vehicleId);
    router.push(`/home/vehicles/${params.row.vehicleId}`);
  };

  const handleDeleteClick = (vehicleEnode: string) => {
    setShowDeleteModal(true);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  // <div className="flex w-full flex-col overflow-x-auto" id="vehicleTable">
  return (
    <Paper sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        // loading={loading}
        onRowClick={handleRowClickEvent}
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
};

export default VehicleList;
