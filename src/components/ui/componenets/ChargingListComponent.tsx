"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
  vehicleId: string;
  chargerId: number;
}

const columns: GridColDef[] = [
  {
    field: "vehicleId",
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
    headerName: "Start Dte",
    flex: 1,
    valueFormatter: (params) => `${params}`, // Format as needed
  },
  {
    field: "DteEnd",
    headerName: "End Dte",
    flex: 1,
    valueFormatter: (params) => `${params}`, // Format as needed
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
    valueGetter: (params) => `${params}%`,
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
    valueFormatter: (params) => new Date(params).toLocaleString(),
  },
  {
    field: "chargerId",
    headerName: "Charger ID",
    flex: 1,
  },
];

const ChargingList = ({
  chargingSessions,
  loading,
}: {
  chargingSessions: ChargingSession[];
  loading: boolean;
}) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        loading={loading}
        rows={chargingSessions}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        pagination
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default ChargingList;
