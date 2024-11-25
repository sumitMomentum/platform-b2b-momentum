"use client";

import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";
import PageName from "@/components/ui/commons/PageName";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { join, parse } from "path";
import { split } from "postcss/lib/list";
import React from "react";
import { Fragment, useEffect, useState } from "react";
import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import InfoIcon from "@mui/icons-material/Info";
import FlashAutoIcon from "@mui/icons-material/FlashAuto";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FlashOffIcon from "@mui/icons-material/FlashOff";

interface ChargerRow {
  id: number;
  chargerId: number;
  chargerLocation: string;
  chargerStatus: string;
  dateJoining: string;
  chargeType: string;
  chargingPoint: string;
}

const Page = () => {
  const [chargerMasterData, setChargerMasterData] = useState<ChargerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "chargerId", headerName: "Charger ID", width: 130 },
    { field: "chargerLocation", headerName: "Charger Location", width: 200 },
    { field: "chargerStatus", headerName: "Charger Status", width: 130 },
    { field: "dateJoining", headerName: "Date Joining", width: 130 },
    { field: "chargeType", headerName: "Charge Type", width: 130 },
    { field: "chargingPoint", headerName: "Charging Point", width: 130 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllChargerMasterData();
        console.log("from the component:", data);
        if (Array.isArray(data)) {
          setChargerMasterData(data);
        } else {
          console.warn("Expected data to be an array:", data);
        }
      } catch (error) {
        console.error("Error fetching charger master data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <PageName
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Chargers", href: "/home/chargers" },
        ]}
      />
      <div className="container">
        <Box style={{ display: "flex", width: "100%", height: "70vh" }}>
          <DataGrid
            rows={chargerMasterData}
            columns={columns}
            autosizeOnMount
            getRowId={(row) => row.id}  // Ensure the row ID is unique
            loading={isLoading}
            autoHeight={true}
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
        </Box>
      </div>
    </Fragment>
  );
};

export default Page;
