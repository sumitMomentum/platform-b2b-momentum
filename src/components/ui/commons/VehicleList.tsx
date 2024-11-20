"use client";
import useVehicleStore from "@/states/store";
import { useEffect, useState } from "react"; // Import only useEffect
import { DataGrid, GridEventListener, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import React from "react";
import { Chip, Toolbar } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { usePathname, useRouter } from "next/navigation";

// Get the current route using useRouter

const baseColumns = [
  { field: "vin", headerName: "VIN", flex: 1 },
  { field: "make", headerName: "Make", flex: 1 },
  { field: "model", headerName: "Model", flex: 1 },
  {
    field: "soc",
    headerName: "SOC",
    flex: 1,
    renderCell: (params) => (
      <Chip
        variant="outlined"
        label={params.value}
        color={
          params.value >= 70
            ? "success"
            : params.value >= 40
            ? "warning"
            : "error"
        }
      />
    ),
  },
];

// Conditionally added columns
const optionalColumns = [
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => (
      <Chip
        variant="outlined"
        label={params.value}
        color={
          params.value === "Active"
            ? "success"
            : params.value === "Charging"
            ? "warning"
            : params.value === "Inactive"
            ? "error"
            : "info"
        }
      />
    ),
  },
  {
    field: "condition",
    headerName: "Condition",
    flex: 1,
    renderCell: (params) => (
      <Chip
        variant="outlined"
        label={params.value}
        color={
          params.value === "Good"
            ? "success"
            : params.value === "Satisfactory"
            ? "warning"
            : "error"
        }
      />
    ),
  },
];

const VehicleList = (props) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const setSelectedVehicleId = useVehicleStore(
    (state) => state.setSelectedVehicleId
  );
  const pathName = usePathname();
  const paginationModel = {
    page: 0,
    pageSize: pathName.replace("/en", "") === "/home/vehicles/list" ? 5 : 3,
  };
  const columns =
    pathName.replace("/en", "") === "/home/vehicles/list"
      ? [...baseColumns, ...optionalColumns]
      : baseColumns;

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
  }, []);

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
    <Paper sx={{ height: "100%", width: "100%", minHeight: 300 }}>
      <DataGrid
        // loading={loading}
        onRowClick={handleRowClickEvent}
        getRowId={(row) => row.vehicleId}
        rows={vehicles}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[3, 5, 10]}
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
            // maxHeight: "300px", // Set a max height for the scrolling area of rows
            minHeight: vehicles.length < 5 ? "300px" : "auto",
          },
        }}
      />
    </Paper>
  );
};

export default VehicleList;
