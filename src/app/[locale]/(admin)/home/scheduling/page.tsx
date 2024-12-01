"use client";

import { getChargingSchedule } from "@/actions/admin/chargingSchedule/getChargingSchedule";
import PageName from "@/components/ui/commons/PageName";
import { Box, Button, Container } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Fragment, useEffect, useState } from "react";
import ScheduleIcon from "@mui/icons-material/Schedule";
import React from "react";

const page = () => {
  const [chargingSchedule, setChargingSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const paginationModel = {
    page: 0,
    pageSize: 10,
  };
  const handleCreateSchedule = async () => {
    try {
      const data = await getChargingSchedule();
      setChargingSchedule(data);
    } catch (error) {
      console.error("Error fetching charging schedule data:", error);
      // Handle the error appropriately (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  // Define columns for DataGrid
  const columns = [
    {
      field: "vin",
      headerName: "Vehicle VIN",
      flex: 1,
      valueGetter: (params, row) => row.vehicle.vin,
    },
    {
      field: "soc",
      headerName: "Vehicle SOC",
      flex: 1,
      valueGetter: (params, row) => row.vehicle.soc,
    },
    {
      field: "chargerId",
      headerName: "Charger ID",
      flex: 1,
      valueGetter: (params, row) => row.charger.chargerId,
    },
    {
      field: "chargerLocation",
      headerName: "Charger Location",
      flex: 1,
      valueFormatter: (params, row) =>
        `${[
          Number(row.charger.chargerLocation.toString().split(",")[0]).toFixed(
            2
          ),
          Number(row.charger.chargerLocation.toString().split(",")[1]).toFixed(
            2
          ),
        ].join(", ")}`,
    },
    {
      field: "scheduleDate",
      headerName: "Schedule Date",
      flex: 1,
      valueFormatter: (value, row) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <Fragment>
      <PageName
        name="Charge Scheduling"
        breadcrumbs={[
          { name: "Home", href: "/home" },
          // { name: "Scheduling", href: "/home/scheduling" },
        ]}
      />
      <Container sx={{ display: "flex", justifyContent: "right", mb: 2 }}>
        <Button
          startIcon={<ScheduleIcon />}
          variant="contained"
          onClick={handleCreateSchedule}
        >
          Create Schedule
        </Button>
      </Container>
      {chargingSchedule.length > 0 ? (
        <Box style={{ display: "flex", width: "100%", height: "80vh" }}>
          <DataGrid
            autoPageSize
            rows={chargingSchedule}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.vehicle.vin}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel } }}
            disableRowSelectionOnClick
            sx={{
              border: 1,
              borderColor: "divider",
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
      ) : (
        <Container sx={{ textAlign: "center", mt: 4 }}>
          No schedule data available.
        </Container>
      )}
    </Fragment>
  );
};

export default page;
