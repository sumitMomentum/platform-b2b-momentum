"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

// Define the column configurations
const columns = [
  {
    field: "TripID",  // TripID for the column
    headerName: "Trip ID",
    flex: 1,
  },
  {
    field: "DteStart",
    headerName: "Start Time",
    flex: 1,
    valueFormatter: (params) => {
      const date = new Date(params.value * 1000); // Assuming DteStart is in Unix timestamp
      return date.toLocaleString();
    },
  },
  {
    field: "DteEnd",
    headerName: "End Time",
    flex: 1,
    valueFormatter: (params) => {
      const date = new Date(params.value * 1000); // Assuming DteEnd is in Unix timestamp
      return date.toLocaleString();
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
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
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
        pageSize={paginationModel.pageSize}
        page={paginationModel.page}
        pagination
        getRowId={(row) => row.TripID} // Ensure TripID is unique for rows
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default TripListComponent;
