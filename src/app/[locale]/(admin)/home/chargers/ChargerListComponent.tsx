"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

// Define ChargerItem type here
type ChargerItem = {
  chargerID: string;
  chargerLocation: string;
  chargerStatus: string;
  dateJoining: string;
  chargeType: string;
  chargingPoint: string;
};

import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";
import { join } from "path";
import { split } from "postcss/lib/list";
import { log } from "console";

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
    chargerMasterData.length && setLoading(false);
    console.log(chargerMasterData);
  }, [chargerMasterData]);

  const columns: GridColDef[] = [
    { field: "chargerID", headerName: "Charger ID", width: 130 },
    {
      field: "chargerLocation",
      headerName: "Charger Location",
      width: 200,
      valueGetter: (params: GridRenderCellParams, row) => {
        return `${[
          Number(row.chargerLocation.toString().split(",")[0]).toFixed(2),
          Number(row.chargerLocation.toString().split(",")[1]).toFixed(2),
        ].join(", ")}`;
      },
    },
    { field: "chargerStatus", headerName: "Charger Status", width: 130 },
    {
      field: "dateJoining",
      headerName: "Date Joining",
      width: 130,
      valueFormatter: (params: GridRenderCellParams) =>
        new Date(params.value as string).toLocaleDateString(),
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
        // autoHeight
        disableColumnMenu
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
      />
    </Paper>
  );
}

export default ChargerListComponent;
