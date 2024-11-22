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
  { field: "DteStart", headerName: "Start DTE", flex: 1 },
  { field: "DteEnd", headerName: "End DTE", flex: 1 },
  { field: "BatteryAtStart", headerName: "Battery Start (%)", flex: 1 },
  { field: "BatteryAtEnd", headerName: "Battery End (%)", flex: 1 },
  { field: "DiffInBat", headerName: "Battery Difference (%)", flex: 1, valueGetter: ({ value }) => `${value}%` },
  { field: "ChargingType", headerName: "Charging Type", flex: 1 },
  { field: "DiffInDte", headerName: "Difference in DTE", flex: 1 },
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
        // initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        // sx={{ border: 0 }}
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
