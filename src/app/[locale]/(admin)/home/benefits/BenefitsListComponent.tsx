"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
// Define BenefitItem type here
export type BenefitItem = {
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
import TrendingUpSharpIcon from "@mui/icons-material/TrendingUpSharp";
import TrendingDownSharpIcon from "@mui/icons-material/TrendingDownSharp";
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";
import { Typography } from "@mui/material";
import ThumbDownAlt from "@mui/icons-material/ThumbDownAlt";
import ThumbUpAlt from "@mui/icons-material/ThumbUpAlt";
import { map } from "svix/dist/openapi/rxjsStub";
import page from "../page";
import style from "styled-jsx/style";

export default function BenefitsListComponent({ benefits, loading }) {
  const columns: GridColDef[] = [
    {
      field: "vin",
      headerName: "VIN",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <>
          {params.value === "Total loss" && (
            <TrendingDownSharpIcon color="error" />
          )}
          {params.value === "Total gains" && (
            <TrendingUpSharpIcon color="success" />
          )}
          <span style={{ marginLeft: 8 }}>{params.value}</span>
        </>
      ),
    },
    {
      field: "batteryCycleSavingMonthly",
      headerName: "Battery Cycle Saving (Monthly)",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "batteryCycleSavingYearly",
      headerName: "Battery Cycle Saving (Yearly)",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "batteryCycleSavingLifetime",
      headerName: "Battery Cycle Saving (Lifetime)",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "costSavingChargingMonthly",
      headerName: "Cost Saving Charging (Monthly)",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "costSavingChargingYearly",
      headerName: "Cost Saving Charging (Yearly)",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "costSavingChargingLifeTimeEstimate",
      headerName: "Cost Saving Charging (Lifetime Estimate)",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "rangeIncreaseMonthly",
      headerName: "Range Increase (Monthly)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
          {params.value}
        </div>
      ),
    },
    {
      field: "rangeIncreaseYearly",
      headerName: "Range Increase (Yearly)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
          {params.value}
        </div>
      ),
    },
    {
      field: "rangeIncreaseLifetimeEstimate",
      headerName: "Range Increase (Lifetime Estimate)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
          {params.value}
        </div>
      ),
    },
    {
      field: "revenueIncreaseLifetime",
      headerName: "Revenue Increase (Lifetime)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
          {params.value}
        </div>
      ),
    },
  ];

  return (
    <Paper sx={{ height: "auto", width: "100%", backgroundColor: "white" }}>
      <Typography variant="h5" sx={{ margin: 3, fontWeight: "bold" }}>
        Overall Profit and Loss
      </Typography>
      <DataGrid
        autoPageSize
        rows={benefits
          .filter((vehicle) => vehicle.vehicleId === "xxxxxxxxxx")
          .sort((a, b) => {
            return a.vin > b.vin ? 1 : -1; // Sort by vin in ascending order
          })}
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
        autoPageSize
        rows={benefits.filter((vehicle) => vehicle.vehicleId !== "xxxxxxxxxx")}
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
