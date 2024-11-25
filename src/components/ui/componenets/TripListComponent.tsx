"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import React from "react";
import { Chip } from "@mui/material";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FlashOffIcon from "@mui/icons-material/FlashOff";

// Define the column configurations
const columns = [
  {
    field: "TripID",
    headerName: "Trip ID",
    flex: 1,
  },
  {
    field: "DteStart",
    headerName: "Dte Start",
    flex: 1,
  },
  {
    field: "DteEnd",
    headerName: "Dte End",
    flex: 1,
  },
  {
    field: "BatteryAtStart",
    headerName: "Battery Start",
    flex: 1,
    renderCell: (params) => (
      <Chip
        icon={<BatteryFullIcon />}
        label={`${params.value}%`}
        color="primary"
      />
    ),
  },
  {
    field: "BatteryAtEnd",
    headerName: "Battery End",
    flex: 1,
    renderCell: (params) => (
      <Chip
        icon={<BatteryChargingFullIcon />}
        label={`${params.value}%`}
        color="secondary"
      />
    ),
  },
  {
    field: "TripApprovedKilometer",
    headerName: "Approved Kilometers",
    flex: 1,
    valueFormatter: (params) =>
      params.value !== undefined ? `${params.value} km` : "22 km",
  },
  {
    field: "DiffInBat",
    headerName: "Battery Diff",
    flex: 1,
  },
  {
    field: "DiffInDte",
    headerName: "Date Diff",
    flex: 1,
  },
  {
    field: "DwUpdated",
    headerName: "Last Update",
    flex: 1,
    valueFormatter: (params) => new Date(params).toLocaleString(),
  },
  {
    field: "Status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => (
      <Chip
        icon={params.value === "Approved" ? <CheckCircleIcon /> : <CancelIcon />}
        label={params.value}
        color={params.value === "Approved" ? "success" : "error"}
      />
    ),
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
