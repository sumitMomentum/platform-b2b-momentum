"use client";
import useVehicleStore from "@/states/store";
import { useEffect, useState } from "react"; // Import only useEffect
import { DataGrid, GridEventListener, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import React from "react";
import { Box, Chip, Toolbar } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { usePathname, useRouter } from "next/navigation";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import Battery1BarIcon from "@mui/icons-material/Battery1Bar";
import Battery2BarIcon from "@mui/icons-material/Battery2Bar";
import Battery3BarIcon from "@mui/icons-material/Battery3Bar";
import Battery4BarIcon from "@mui/icons-material/Battery4Bar";
import Battery5BarIcon from "@mui/icons-material/Battery5Bar";
import Battery6BarIcon from "@mui/icons-material/Battery6Bar";
import BatteryStdIcon from "@mui/icons-material/BatteryStd";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ChargingStationIcon from "@mui/icons-material/ChargingStation";
import InfoIcon from "@mui/icons-material/Info";
import GppGoodIcon from "@mui/icons-material/GppGood";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import GppBadIcon from "@mui/icons-material/GppBad";

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
        icon={
          params.value >= 100 ? (
            <BatteryStdIcon />
          ) : params.value >= 85 ? (
            <Battery6BarIcon />
          ) : params.value >= 65 ? (
            <Battery5BarIcon />
          ) : params.value >= 50 ? (
            <Battery4BarIcon />
          ) : params.value >= 40 ? (
            <Battery3BarIcon />
          ) : params.value >= 30 ? (
            <Battery2BarIcon />
          ) : params.value >= 20 ? (
            <Battery1BarIcon />
          ) : params.value >= 10 ? (
            <Battery0BarIcon />
          ) : (
            <BatteryAlertIcon />
          )
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
        icon={
          params.value === "Active" ? (
            <ToggleOnIcon />
          ) : params.value === "Charging" ? (
            <ChargingStationIcon />
          ) : params.value === "Inactive" ? (
            <ToggleOffIcon />
          ) : (
            <InfoIcon />
          )
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
        icon={
          params.value === "Good" ? (
            <GppGoodIcon />
          ) : params.value === "Satisfactory" ? (
            <GppMaybeIcon />
          ) : (
            <GppBadIcon />
          )
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
    <Box
      sx={
        pathName.replace("/en", "") === "/home/vehicles/list"
          ? { display: "flex", width: "100%", height: "50vh" }
          : { height: "100%", width: "100%", minHeight: 300 }
      }
    >
      <DataGrid
        // loading={loading}
        onRowClick={handleRowClickEvent}
        getRowId={(row) => row.vehicleId}
        rows={vehicles}
        columns={columns}
        loading={loading}
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
          ".MuiDataGrid-columnHeaders": {
            fontWeight: "bold",
            fontSize: "0.9rem", // Optional: Adjust font size for better visibility
          },
          ".MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", // Ensures header titles specifically are bold
          },
        }}
      />
    </Box>
  );
};

export default VehicleList;
