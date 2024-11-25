"use client";
import React, { useState } from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import React from "react";
import { Chip } from "@mui/material";
import FlashAutoIcon from '@mui/icons-material/FlashAuto'; // Import for fast charging
import BoltIcon from '@mui/icons-material/Bolt'; // Import for slow charging
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
import BatterySaverIcon from '@mui/icons-material/BatterySaver'; // Import for charging percentage
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

// Define the interface for the Charging Session
interface ChargingSession {
  id: number;
  TripID: number;
  DteStart: string; // Assuming these are ISO date strings
  DteEnd: string;
  BatteryAtStart: number;
  BatteryAtEnd: number;
  DwUpdated: string; // ISO date string
  DiffInBat: number;
  ChargingType: string;
  DiffInDte: number;
  vehicleId: string;
  chargerId: number;
}

interface ChargingListProps {
  loading: boolean;
  chargingSessions: ChargingSession[];
}

// Function to get charging icon and color based on type
const getChargingProps = (type) => {
  if (type === "FAST") return { icon: <FlashAutoIcon />, color: "primary" };
  if (type === "SLOW") return { icon: <BoltIcon />, color: "warning" };
  return { icon: null, color: "default" };
};

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

const columns: GridColDef[] = [
  { field: "vehicleId", headerName: "Vehicle ID", flex: 1 },
  // { field: "TripID", headerName: "Trip ID", flex: 1 },
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
    headerName: "Battery Start (%)",
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
    headerName: "Battery End (%)",
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
    field: "DiffInBat",
    headerName: "Charging (%)",
    flex: 1,
    renderCell: (params) => (
      <Chip
        label={`${params.value}%`}
        icon={<BatterySaverIcon />}
      />
    ),
  },  
  {
    field: "ChargingType",
    headerName: "Charging Type",
    flex: 1,
    renderCell: (params) => {
      const { icon, color } = getChargingProps(params.value);
      return (
        <Chip
          variant="outlined"
          label={params.value}
          icon={icon}
          color={color}
        />
      );
    },
  },
  {
    field: "DiffInDte",
    headerName: "Range Added",
    flex: 1,
    renderCell: (params) => (
      <Chip
        label={`${params.value} km`}
        icon={<ArrowOutwardIcon style={{ marginLeft: 'auto' }} />}
      />
    ),
  },  
  { field: "DwUpdated", headerName: "Last Updated", flex: 1 },
  { field: "chargerId", headerName: "Charger ID", flex: 1 },
];

const ChargingList: React.FC<ChargingListProps> = ({ loading, chargingSessions }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  return (
    <Paper sx={{ height: 600, width: "100%" }}>
      <DataGrid
        loading={loading}
        rows={chargingSessions}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        sx={{
          backgroundColor: "white",
          ".MuiDataGrid-columnHeaders": {
            fontWeight: "bold",
            fontSize: "0.9rem", // Optional: Adjust font size for better visibility
          },
          ".MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", // Ensures header titles specifically are bold
          },
        }}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Paper>
  );
};

export default ChargingList;
