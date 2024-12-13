"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TrendingUpSharpIcon from "@mui/icons-material/TrendingUpSharp";
import TrendingDownSharpIcon from "@mui/icons-material/TrendingDownSharp";
import { Typography } from "@mui/material";

// Define BenefitItem type directly here
type BenefitItem = {
  vin: string;
  vehicleId: string;
  batteryCycleSavingMonthly: number;
  batteryCycleSavingYearly: number;
  batteryCycleSavingLifetime: number;
  costSavingChargingMonthly: number;
  costSavingChargingYearly: number;
  costSavingChargingLifeTimeEstimate: number;
  rangeIncreaseMonthly: number;
  rangeIncreaseYearly: number;
  rangeIncreaseLifetimeEstimate: number;
  revenueIncreaseLifetime: number;
};

interface BenefitsListComponentProps {
  benefits: BenefitItem[];
  overall: {
    overallProfit: BenefitItem;
    overallLoss: BenefitItem;
  };
  loading: boolean;
}

export default function BenefitsListComponent({
  benefits,
  overall,
  loading,
}: BenefitsListComponentProps) {
  const columns: GridColDef[] = [
    {
      field: "vin",
      headerName: "VIN",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <>
          {params.value === "Total loss" && <TrendingDownSharpIcon color="error" />}
          {params.value === "Total gains" && <TrendingUpSharpIcon color="success" />}
          <span style={{ marginLeft: 8 }}>{params.value}</span>
        </>
      ),
    },
    {
      field: "batteryCycleSavingMonthly",
      headerName: "Battery Cycle Saving (Monthly)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? params.value.toFixed(2) : params.value,
    },
    {
      field: "batteryCycleSavingYearly",
      headerName: "Battery Cycle Saving (Yearly)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? params.value.toFixed(2) : params.value,
    },
    {
      field: "batteryCycleSavingLifetime",
      headerName: "Battery Cycle Saving (Lifetime)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? params.value.toFixed(2) : params.value,
    },
    {
      field: "costSavingChargingMonthly",
      headerName: "Cost Saving Charging (Monthly)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? params.value.toFixed(2) : params.value,
    },
    {
      field: "costSavingChargingYearly",
      headerName: "Cost Saving Charging (Yearly)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? params.value.toFixed(2) : params.value,
    },
    {
      field: "costSavingChargingLifeTimeEstimate",
      headerName: "Cost Saving Charging (Lifetime Estimate)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? params.value.toFixed(2) : params.value,
    },
    {
      field: "rangeIncreaseMonthly",
      headerName: "Range Increase (Monthly)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? (
          <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
            {params.value.toFixed(2)}
          </div>
        ) : (
          params.value
        ),
    },
    {
      field: "rangeIncreaseYearly",
      headerName: "Range Increase (Yearly)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? (
          <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
            {params.value.toFixed(2)}
          </div>
        ) : (
          params.value
        ),
    },
    {
      field: "rangeIncreaseLifetimeEstimate",
      headerName: "Range Increase (Lifetime Estimate)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? (
          <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
            {params.value.toFixed(2)}
          </div>
        ) : (
          params.value
        ),
    },
    {
      field: "revenueIncreaseLifetime",
      headerName: "Revenue Increase (Lifetime)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        typeof params.value === "number" ? (
          <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
            {params.value.toFixed(2)}
          </div>
        ) : (
          params.value
        ),
    },
  ];
  
  return (
    <Paper sx={{ height: "auto", width: "100%", backgroundColor: "white" }}>
      <Typography variant="h5" sx={{ margin: 3, fontWeight: "bold" }}>
        Overall Profit and Loss
      </Typography>
      <DataGrid
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        rows={[overall.overallProfit, overall.overallLoss]}
        columns={columns}
        getRowId={(row) => row.vin}
        loading={loading}
        autoHeight
        disableColumnMenu
        hideFooterPagination
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

      <Typography variant="h5" sx={{ margin: 3, fontWeight: "bold" }}>
        Details:
      </Typography>
      <DataGrid
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        rows={benefits}
        columns={columns}
        getRowId={(row) => row.vin}
        loading={loading}
        autoHeight
        disableColumnMenu
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
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
}
