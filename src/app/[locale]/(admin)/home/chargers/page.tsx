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
  chargerID: string;
  chargerLocation: string;
  chargerStatus: string;
  dateJoining: string;
  chargeType: string;
  chargingPoint: string;
}

const page = () => {
  // const [chargerMasterData, setChargerMasterData] = useState<ChargerRow[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const columns: GridColDef[] = [
    { field: "chargerID", headerName: "Charger ID", minWidth: 200 },
    {
      field: "chargerLocation",
      headerName: "Charger Location",
      minWidth: 200,
      valueFormatter: (value: any, row: any) =>
        `${[
          Number(value.toString().split(",")[0]).toFixed(2),
          Number(value.toString().split(",")[1]).toFixed(2),
        ].join(", ")}`,
    },
    {
      field: "chargerStatus",
      headerName: "Charger Status",
      minWidth: 200,
      renderCell: (params) => (
        <Chip
          variant="outlined"
          label={params.value}
          color={
            params.value === "Active"
              ? "success"
              : params.value === "Charging"
              ? "warning"
              : params.value === "Inactive"
              ? "error"
              : "info"
          }
          icon={
            params.value === "Active" ? (
              <PowerIcon />
            ) : params.value === "Inactive" ? (
              <PowerOffIcon />
            ) : (
              <InfoIcon />
            )
          }
        />
      ),
    },
    {
      field: "dateJoining",
      headerName: "Date Joining",
      minWidth: 200,
      valueFormatter: (value, row) => new Date(value).toLocaleDateString(),
    },
    {
      field: "chargeType",
      headerName: "Charge Type",
      minWidth: 200,
      renderCell: (params) => (
        <Chip
          variant="outlined"
          label={params.value}
          // color={
          //   params.value.toLowerCase().includes("fast")
          //     ? "success"
          //     : params.value.toLowerCase().includes("normal")
          //     ? "warning"
          //     : "info"
          // }
          icon={
            params.value.toLowerCase().includes("fast") ? (
              <FlashAutoIcon />
            ) : params.value.toLowerCase().includes("normal") ? (
              <FlashOnIcon />
            ) : (
              <FlashOffIcon />
            )
          }
        />
      ),
    },
    { field: "chargingPoint", headerName: "Charging Point", minWidth: 200 },
  ];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getAllChargerMasterData();
  //       console.log("from the component:", data);
  //       if (Array.isArray(data)) {
  //         setChargerMasterData(data);
  //       } else {
  //         console.warn("Expected data to be an array:", data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching charger master data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <Fragment>
      <PageName
        name={"Chargers"}
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
            getRowId={(row) => row.chargerID}
            loading={loading}
            autosizeOnMount
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

export default page;
