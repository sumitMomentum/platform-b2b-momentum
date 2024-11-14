"use client";

import { getChargingSessions } from "@/actions/admin/chargingModule/getAllChargingSessions";
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
  vehicleReference: string;
  chargerReference: number;
}

const columns: GridColDef[] = [
  { field: "vehicleReference", headerName: "Vehicle ID", flex: 1 },
  { field: "TripID", headerName: "Trip ID", flex: 1 },
  {
    field: "DteStart",
    headerName: "Start Date",
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
    field: "DteEnd",
    headerName: "End Date",
    flex: 1,
    valueFormatter: (params) => `Day ${params.value}`, // Format as needed
  },
  { field: "BatteryAtStart", headerName: "Battery Start (%)", flex: 1 },
  { field: "BatteryAtEnd", headerName: "Battery End (%)", flex: 1 },
  {
    field: "DiffInBat",
    headerName: "Battery Difference (%)",
    flex: 1,
    valueGetter: (params) => `${params.row.BatteryAtEnd - params.row.BatteryAtStart}%`,
  },
  { field: "ChargingType", headerName: "Charging Type", flex: 1 },
  { field: "DiffInDte", headerName: "Duration (Days)", flex: 1 },
  {
    field: "DwUpdated",
    headerName: "Last Updated",
    flex: 1,
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
  },
  { field: "chargerReference", headerName: "Charger ID", flex: 1 },
];

const ChargingList = () => {
  const [chargingSessions, setChargingSessions] = useState<ChargingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChargingSessions();
        console.log("from the component:", data);
        if (Array.isArray(data)) {
          setChargingSessions(data);
        } else {
          console.warn("Expected data to be an array:", data);
        }
      } catch (error) {
        console.error("Error fetching charging sessions data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Paper sx={{ height: 600, width: "100%" }}>
      <DataGrid
        loading={loading}
        rows={chargingSessions}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        pagination
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default ChargingList;
