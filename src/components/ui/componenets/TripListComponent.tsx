"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import React from "react";
import { Chip } from "@mui/material";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import Battery1BarIcon from "@mui/icons-material/Battery1Bar";
import Battery2BarIcon from "@mui/icons-material/Battery2Bar";
import Battery3BarIcon from "@mui/icons-material/Battery3Bar";
import Battery4BarIcon from "@mui/icons-material/Battery4Bar";
import Battery5BarIcon from "@mui/icons-material/Battery5Bar";
import Battery6BarIcon from "@mui/icons-material/Battery6Bar";
import BatteryStdIcon from "@mui/icons-material/BatteryStd";
import CancelIcon from "@mui/icons-material/Cancel";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FlashOffIcon from "@mui/icons-material/FlashOff";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ChargingStationIcon from "@mui/icons-material/ChargingStation";
import InfoIcon from "@mui/icons-material/Info";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';


// Function to get battery icon based on value
const getBatteryIcon = (value) => {
  if (value >= 100) return <BatteryStdIcon />;
  if (value >= 85) return <Battery6BarIcon />;
  if (value >= 65) return <Battery5BarIcon />;
  if (value >= 50) return <Battery4BarIcon />;
  if (value >= 40) return <Battery3BarIcon />;
  if (value >= 30) return <Battery2BarIcon />;
  if (value >= 20) return <Battery1BarIcon />;
  if (value >= 10) return <Battery0BarIcon />;
  return <BatteryAlertIcon />;
};

// Function to get status icon based on value
const getStatusIcon = (value) => {
  switch (value) {
    case "Active":
      return <ToggleOnIcon />;
    case "Charging":
      return <ChargingStationIcon />;
    case "Inactive":
      return <ToggleOffIcon />;
    default:
      return <InfoIcon />;
  }
};

// Function to get kilometer color based on value
const getKmColor = (value) => {
  if (value < 20) return "error";
  if (value < 50) return "warning";
  return "primary";
};

// Define the column configurations
const columns = [
  {
    field: "TripID",
    headerName: "Trip ID",
    flex: 1,
  },
  {
    field: "DteStart",
    headerName: "Start DTE",
    flex: 1,
    valueFormatter: (params) => `${params} km`,
  },
  {
    field: "DteEnd",
    headerName: "End DTE",
    flex: 1,
    valueFormatter: (params) => `${params} km`,
  },
  {
    field: "BatteryAtStart",
    headerName: "Battery Start",
    flex: 1,
    renderCell: (params) => (
      <Chip
        variant="outlined"
        label={`${params.value}%`}
        color={
          params.value >= 70
            ? "success"
            : params.value >= 40
            ? "warning"
            : "error"
        }
        icon={getBatteryIcon(params.value)}
      />
    ),
  },
  {
    field: "BatteryAtEnd",
    headerName: "Battery End",
    flex: 1,
    renderCell: (params) => (
      <Chip
        variant="outlined"
        label={`${params.value}%`}
        color={
          params.value >= 70
            ? "success"
            : params.value >= 40
            ? "warning"
            : "error"
        }
        icon={getBatteryIcon(params.value)}
      />
    ),
  },
  {
    field: "TripApprovedKilometer",
    headerName: "Approved Kilometers",
    flex: 1,
    renderCell: (params) => (
      <Chip
        variant="outlined"
        label={`${params.value.toFixed(2)} km`}
        color={getKmColor(params.value)}
        icon={<SpeedIcon />}
      />
    ),
  },
  {
    field: "DiffInBat",
    headerName: "Battery Diff",
    flex: 1,
    valueFormatter: (params) => `${params}%`,
  },
  {
    field: "DiffInDte",
    headerName: "Diff in Dte",
    flex: 1,
    renderCell: (params) => <Chip label={`${params.value} km`} />,
  },
  {
    field: "DwUpdated",
    headerName: "Last Update",
    flex: 1,
    valueFormatter: (params) => new Date(params).toLocaleString(),
  },
];

const TripListComponent = ({ tripSessions, loading }) => {
  return (
    <Paper sx={{ height: "auto", width: "100%", p: 2 }}>
      <DataGrid
        loading={loading}
        rows={tripSessions} // Use the tripSessions prop directly
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        sx={{
          backgroundColor: "white",
          ".MuiDataGrid-columnHeaders": {
            fontWeight: "bold",
            fontSize: "0.9rem", // Optional: Adjust font size for better visibility
          },
          ".MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", // Ensures header titles specifically are bold
          },
          ".MuiDataGrid-virtualScroller": {
            overflowY: "auto",
            maxHeight: "70vh", // Set a max height for the scrolling area of rows
          },
        }}
        getRowId={(row) => row.TripID} // Ensure TripID is unique for rows
      />
    </Paper>
  );
};

export default TripListComponent;
