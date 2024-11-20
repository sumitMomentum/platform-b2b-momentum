"use client";
import { getChargingSessions } from "@/actions/admin/chargingModule/getAllChargingSessions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import React from "react";


interface ChargingSession {
  id: number;
  chargerId: number;
  vehicleId: string;
  chargingDate: Date;
  duration: number;
  chargingStartTime: Date;
  chargingEndTime: Date;
  powerConsumed: number;
  vehicleStartSoc: number;
  vehicleEndSoc: number;
  // charger: {
  //   chargerID: number;
  //   chargerLocation: string;
  //   chargerStatus: string;
  // };
  // vehicle: {
  //   model: string | null;
  //   make: string | null;
  //   vin: string | null;
  // };
}

const columns = [
  {
    field: "vehicle",
    headerName: "Vehicle",
    flex: 1,
    valueGetter: (value, row) => `${row.vehicleId}`,
  },
  // {
  //   field: "chargerLocation",
  //   headerName: "Charger Location",
  //   flex: 1,
  //   valueGetter: (value, row) => row.charger.chargerLocation,
  // },
  {
    field: "chargingStartTime",
    headerName: "Start Time",
    flex: 1,
    valueFormatter: (value, row) => new Date(value).toLocaleString(),
  },
  {
    field: "chargingEndTime",
    headerName: "End Time",
    flex: 1,
    valueFormatter: (value, row) => new Date(value).toLocaleString(),
  },
  {
    field: "duration",
    headerName: "Duration",
    flex: 1,
    valueFormatter: (value, row) => `${Math.floor(value / 60)}h ${value % 60}m`,
  },
  {
    field: "powerConsumed",
    headerName: "Energy Used",
    flex: 1,
    valueFormatter: (value, row) => `${value.toFixed(2)} kWh`,
  },
  {
    field: "socChange",
    headerName: "SoC Change",
    flex: 1,
    valueGetter: (value, row) =>
      `${row.vehicleStartSoc}% → ${row.vehicleEndSoc}%`,
  },
  // {
  //   field: "chargerStatus",
  //   headerName: "Charger Status",
  //   flex: 1,
  //   valueGetter: (value, row) => row.charger.chargerStatus,
  // },
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
      />
    </Paper>
  );
};

export default ChargingList;
