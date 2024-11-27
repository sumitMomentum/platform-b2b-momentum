"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

// Define ChargerItem type here
type ChargerItem = {
  chargerId: string;
  chargerLocation: string;
  chargerStatus: string;
  dateJoining: string;
  chargeType: string;
  chargingPoint: string;
};

import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";

// interface ChargerListComponentProps {
//   initialChargerMasterData: ChargerItem[];
// }

function ChargerListComponent() {
  const [chargerMasterData, setChargerMasterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllChargerMasterData();
        console.log("Fetched Data:", data); // Log the fetched data
        setChargerMasterData(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching charger master data:", error);
        setLoading(false);
      }
    };

    fetchData();
    console.log("chargerMasterData :", chargerMasterData);
  }, []);

  const columns: GridColDef[] = [
    { field: "chargerID", headerName: "Charger ID", width: 130 },
    {
      field: "chargerLocation",
      headerName: "Charger Location",
      width: 200,
      valueGetter: (params: GridRenderCellParams) => {
        const coords = params.row.chargerLocation.split(",");
        return `${Number(coords[0]).toFixed(6)}, ${Number(coords[1]).toFixed(
          6
        )}`;
      },
    },
    { field: "chargerStatus", headerName: "Charger Status", width: 130 },
    {
      field: "dateJoining",
      headerName: "Date Joining",
      width: 130,
      valueFormatter: (params: GridRenderCellParams) => {
        return new Date(params.value).toLocaleDateString(); // Format the date
      },
    },
    { field: "chargeType", headerName: "Charge Type", width: 130 },
    { field: "chargingPoint", headerName: "Charging Point", width: 130 },
  ];

  return (
    <Paper sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={chargerMasterData}
        columns={columns}
        getRowId={(row) => row.chargerID}
        loading={loading}
        disableColumnMenu
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
}

export default ChargerListComponent;