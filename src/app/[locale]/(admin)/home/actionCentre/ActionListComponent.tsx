"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import GppGoodIcon from "@mui/icons-material/GppGood";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import GppBadIcon from "@mui/icons-material/GppBad";
import VerifiedIcon from "@mui/icons-material/Verified";
// Define ActionItem type here
type ActionItem = {
  id: number;
  vin: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  bestPractice: string;
  actionToBeTaken: string;
  confirm: boolean;
  CreatedDateTime: string;
  ClosedDateTime?: string;
};

// Import getAllVehicleActions
import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions";
import { Button, Chip } from "@mui/material";

interface ActionListComponentProps {
  actions: ActionItem[];
  loading: boolean;
}

const columns: GridColDef[] = [
  { field: "vin", headerName: "VIN", flex: 1 },
  {
    field: "severity",
    headerName: "Severity",
    flex: 1,
    renderCell: (params) => (
      <Chip
        variant="outlined"
        label={params.value}
        color={
          params.value === "High"
            ? "error"
            : params.value === "Medium"
            ? "warning"
            : "success"
        }
        icon={
          params.value === "High" ? (
            <GppGoodIcon />
          ) : params.value === "Medium" ? (
            <GppMaybeIcon />
          ) : (
            <GppBadIcon />
          )
        }
      />
    ),
  },
  { field: "description", headerName: "Description", flex: 1 },
  { field: "bestPractice", headerName: "Best Practice", flex: 1 },
  { field: "actionToBeTaken", headerName: "Action To be Taken", flex: 1 },
  {
    field: "confirm",
    headerName: "Confirm",
    flex: 1,
    renderCell: (params) =>
      params.value ? (
        <Chip
          label="Action Closed"
          color="success"
          variant="outlined"
          icon={<VerifiedIcon />}
        />
      ) : (
        <Button variant="contained" color="primary">
          Take Action
        </Button>
      ),
  },
  {
    field: "createdDateTime",
    headerName: "Created Date",
    flex: 1,
    renderCell: (params) => {
      const timestamp = Date.parse(params.value);
      return isNaN(timestamp)
        ? "Invalid Date"
        : new Date(timestamp).toLocaleString();
    },
  },
  {
    field: "closedDateTime",
    headerName: "Closed Date",
    flex: 1,
    renderCell: (params) => {
      const timestamp = Date.parse(params.value);
      return isNaN(timestamp)
        ? "Invalid Date"
        : new Date(timestamp).toLocaleString();
    },
  },
];

const ActionListComponent: React.FC<ActionListComponentProps> = ({
  actions,
  loading,
}) => {
  return (
    <Paper sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={actions}
        columns={columns}
        getRowId={(row) => row.id} // Use `id` for row identification
        loading={loading}
        autoHeight
        // disableColumnMenu
        disableRowSelectionOnClick
        disableColumnSelector
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
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
      />
    </Paper>
  );
};

export default ActionListComponent;
