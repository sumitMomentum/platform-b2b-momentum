"use client";
import useVehicleStore from "@/states/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Import only useEffect
import { DataGrid, GridEventListener, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import React from "react";
import { Toolbar } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const setSelectedVehicleId = useVehicleStore(
    (state) => state.setSelectedVehicleId
  );

  useEffect(() => {
    const getVehicles = async () => {
      if (!vehicles || vehicles.length === 0) {
        const userVehiclesFromDB = await getUserVehicles();
        setVehicles(userVehiclesFromDB);
        setSelectedVehicleId("");
      }
      setLoading(false);
    };

    getVehicles();
  }, [vehicles]);

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
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        // loading={loading}
        onRowClick={handleRowClickEvent}
        getRowId={(row) => row.vehicleId}
        rows={vehicles}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
        sx={{
          border: 0,
          height: "100%",
          overflow: "no-scroll", // Prevent the entire grid from scrolling
          "& .MuiDataGrid-columnHeaders": {
            position: "sticky",
            top: 0,
            zIndex: 1, // Ensure headers are above other content
            backgroundColor: "white", // Set background color to avoid transparency issues
          },
          "& .MuiDataGrid-footerContainer": {
            position: "sticky",
            bottom: 0,
            zIndex: 1, // Ensure footer is above other content
            backgroundColor: "white", // Set background color to avoid transparency issues
            // Add additional styles if needed
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "auto", // Enable vertical scrolling for rows
            maxHeight: "300px", // Set a max height for the scrolling area of rows
          },
        }}
      />
    </Paper>
  );
};

export default VehicleList;
