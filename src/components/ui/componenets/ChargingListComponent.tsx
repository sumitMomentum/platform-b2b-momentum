"use client";

import { getChargingSessions } from "@/actions/admin/chargingModule/getAllChargingSessions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

// Define the interface for the Charging Session
interface ChargingSession {
  id: number;
  TripID: number;
  DteStart: number;
  DteEnd: number;
  BatteryAtStart: number;
  BatteryAtEnd: number;
  DwUpdated: string; // ISO date string
  DiffInBat: number;
  ChargingType: string;
  DiffInDte: number;
  vehicleReference: string;
  chargerReference: number;
}

const columns = [
  {
    field: "vehicleReference",
    headerName: "Vehicle ID",
    flex: 1,
  },
  {
    field: "TripID",
    headerName: "Trip ID",
    flex: 1,
  },
  {
    field: "DteStart",
    headerName: "Start Date",
    flex: 1,
    valueFormatter: (params) => `Day ${params.value}`, // Format as needed
  },
  {
    field: "DteEnd",
    headerName: "End Date",
    flex: 1,
    valueFormatter: (params) => `Day ${params.value}`, // Format as needed
  },
  {
    field: "BatteryAtStart",
    headerName: "Battery Start (%)",
    flex: 1,
  },
  {
    field: "BatteryAtEnd",
    headerName: "Battery End (%)",
    flex: 1,
  },
  {
    field: "DiffInBat",
    headerName: "Battery Difference (%)",
    flex: 1,
    valueGetter: (params) => `${params.row.BatteryAtEnd - params.row.BatteryAtStart}%`,
  },
  {
    field: "ChargingType",
    headerName: "Charging Type",
    flex: 1,
  },
  {
    field: "DiffInDte",
    headerName: "Duration (Days)",
    flex: 1,
  },
  {
    field: "DwUpdated",
    headerName: "Last Updated",
    flex: 1,
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
  },
  {
    field: "chargerReference",
    headerName: "Charger ID",
    flex: 1,
  },
];

const paginationModel = { page: 0, pageSize: 10 };

const ChargingList = ({
  chargingSessions,
  loading,
}: {
  chargingSessions: ChargingSession[];
  loading: boolean;
}) => {
  const router = useRouter();

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        loading={loading}
        rows={chargingSessions}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        paginationModel={paginationModel}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default ChargingList;
