"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import React from "react";

export interface TripSession {
  chargeConsumed: number;
  createdAt: Date;
  distanceTravelled: number;
  endSoc: number;
  endTime: Date;
  id: number;
  odometerEnd: number;
  odometerStart: number;
  startSoc: number;
  startTime: Date;
  tripDuration: number;
  updatedAt: Date;
  vehicleId: string;
}

const columns = [
  {
    field: "vehicle",
    headerName: "Vehicle",
    flex: 1,
    valueGetter: (value, row) => `${row.vehicleId}`,
    // `${row.vehicle.make || ""} ${row.vehicle.model || ""}`,
  },
  {
    field: "startTime",
    headerName: "Start Time",
    flex: 1,
    valueFormatter: (value, row) => new Date(value).toLocaleString(),
  },
  {
    field: "endTime",
    headerName: "End Time",
    flex: 1,
    valueFormatter: (value, row) => new Date(value).toLocaleString(),
  },
  {
    field: "tripDuration",
    headerName: "Duration",
    flex: 1,
    valueFormatter: (value, row) => `${Math.floor(value / 60)}h ${value % 60}m`,
  },
  {
    field: "distanceTravelled",
    headerName: "Distance",
    flex: 1,
    valueFormatter: (value, row) => `${value.toFixed(2)} km`,
  },
  {
    field: "chargeConsumed",
    headerName: "Energy Used",
    flex: 1,
    valueFormatter: (value, row) => `${value.toFixed(2)} kWh`,
  },
  {
    field: "socChange",
    headerName: "SoC Change",
    flex: 1,
    valueGetter: (value, row) => `${row.startSoc}% → ${row.endSoc}%`,
  },
];

const paginationModel = { page: 0, pageSize: 10 };

const TripList = ({
  tripSessions,
  loading,
}: {
  tripSessions: TripSession[];
  loading: boolean;
}) => {
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        loading={loading}
        rows={tripSessions}
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
      />
    </Paper>
  );
};

export default TripList;
