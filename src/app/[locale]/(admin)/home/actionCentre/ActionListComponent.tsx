"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

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
  initialActionItems: ActionItem[];
}

const ActionListComponent: React.FC = () => {
  // const actionItems: ActionItem[] = await getAllVehicleActions();

  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actions = await getAllVehicleActions();
        setActionItems(actions || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch action items", error);
        setLoading(false);
      }
    };

    fetchData();
    setLoading(false);
  }, []);

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
          <Chip label="Action Closed" color="success" variant="outlined" />
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

  return (
    <Paper sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={actionItems}
        columns={columns}
        getRowId={(row) => row.vin}
        loading={loading || actionItems.length == 0}
        autoHeight
        disableColumnMenu
        disableRowSelectionOnClick
        disableColumnSelector
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        sx={{
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
