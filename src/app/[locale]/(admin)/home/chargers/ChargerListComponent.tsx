"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { ChargerItem } from "@/types"; // Assuming you have defined ChargerItem type in a separate file
import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";

interface ChargerListComponentProps {
  initialChargerMasterData: ChargerItem[];
}

const ChargerListComponent: React.FC<ChargerListComponentProps> = ({ initialChargerMasterData }) => {
  const [chargerMasterData, setChargerMasterData] = useState<ChargerItem[]>(initialChargerMasterData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllChargerMasterData();
        setChargerMasterData(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching charger master data:", error);
        setLoading(false);
      }
    };

    if (initialChargerMasterData.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [initialChargerMasterData]);

  const columns: GridColDef[] = [
    { field: "chargerID", headerName: "Charger ID", width: 130 },
    {
      field: "chargerLocation",
      headerName: "Charger Location",
      width: 200,
      valueFormatter: (params) => 
        `${[
          Number(params.value.toString().split(",")[0]).toFixed(2),
          Number(params.value.toString().split(",")[1]).toFixed(2),
        ].join(", ")}`,
    },
    { field: "chargerStatus", headerName: "Charger Status", width: 130 },
    {
      field: "dateJoining",
      headerName: "Date Joining",
      width: 130,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "chargeType", headerName: "Charge Type", width: 130 },
    { field: "chargingPoint", headerName: "Charging Point", width: 130 },
  ];

  return (
    <Paper sx={{ height: 'auto', width: '100%' }}>
      <DataGrid
        rows={chargerMasterData}
        columns={columns}
        getRowId={(row) => row.chargerID}
        loading={loading}
        autoHeight
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
};

export default ChargerListComponent;
