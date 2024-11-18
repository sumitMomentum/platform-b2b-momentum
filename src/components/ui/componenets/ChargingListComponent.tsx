import React, { useState } from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

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

const columns: GridColDef[] = [
  { field: "vehicleId", headerName: "Vehicle ID", flex: 1 },
  { field: "TripID", headerName: "Trip ID", flex: 1 },
  { field: "DteStart", headerName: "Start Date", flex: 1, valueFormatter: ({ value }) => new Date(value).toLocaleString() },
  { field: "DteEnd", headerName: "End Date", flex: 1, valueFormatter: ({ value }) => new Date(value).toLocaleString() },
  { field: "BatteryAtStart", headerName: "Battery Start (%)", flex: 1 },
  { field: "BatteryAtEnd", headerName: "Battery End (%)", flex: 1 },
  { field: "DiffInBat", headerName: "Battery Difference (%)", flex: 1, valueGetter: ({ value }) => `${value}%` },
  { field: "ChargingType", headerName: "Charging Type", flex: 1 },
  { field: "DiffInDte", headerName: "Duration (Days)", flex: 1 },
  { field: "DwUpdated", headerName: "Last Updated", flex: 1, valueFormatter: ({ value }) => new Date(value).toLocaleString() },
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
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default ChargingList;
