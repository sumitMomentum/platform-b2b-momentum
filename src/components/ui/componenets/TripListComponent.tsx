"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import React from "react";

// Define the column configurations
const columns = [
  {
    field: "TripID",  // TripID for the column
    headerName: "Trip ID",
    flex: 1,
  },
  {
    field: "DteStart",
    headerName: "Dte Start",
    flex: 1,
    valueFormatter: (params) => {
      // const date = new Date(params); // Assuming DteStart is in Unix timestamp
      // return date.toLocaleString();
      return params;
    },
  },
  {
    field: "DteEnd",
    headerName: "Dte End",
    flex: 1,
    valueFormatter: (params) => {
      // const date = new Date(params); // Assuming DteEnd is in Unix timestamp
      // return date.toLocaleString();
      return params;
    },
  },
  {
    field: "BatteryAtStart",
    headerName: "Battery Start",
    flex: 1,
  },
  {
    field: "BatteryAtEnd",
    headerName: "Battery End",
    flex: 1,
  },
  {
    field: "TripApprovedKilometer",
    headerName: "Approved Kilometers",
    flex: 1,
    valueFormatter: (params) => `${params} km`,
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
];

const TripListComponent = ({ tripSessions, loading }: { tripSessions: any[]; loading: boolean }) => {
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        loading={loading}
        rows={tripSessions}  // Use the tripSessions prop directly
        columns={columns}

        // initialState={{ pagination: { paginationModel } }}
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
        }}
      getRowId={(row) => row.TripID} // Ensure TripID is unique for rows
        

      />
    </Paper>
  );
};

export default TripListComponent;
