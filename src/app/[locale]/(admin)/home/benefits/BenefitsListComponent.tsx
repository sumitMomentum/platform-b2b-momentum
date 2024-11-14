"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
// Define BenefitItem type here
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

import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";
import { Typography } from "@mui/material";
import ThumbDownAlt from "@mui/icons-material/ThumbDownAlt";
import ThumbUpAlt from "@mui/icons-material/ThumbUpAlt";
import { map } from "svix/dist/openapi/rxjsStub";
import page from "../page";

const BenefitsListComponent: React.FC = () => {
  const [vehicleBenefits, setVehicleBenefits] = useState<BenefitItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVehicleBenefits();
        setVehicleBenefits(data || []);
      } catch (error) {
        console.error("Error fetching vehicle benefits data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "vin",
      headerName: "VIN",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <div>{params.value}</div>,
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
    <Paper sx={{ height: "auto", width: "100%" }}>
      <Typography variant="h5" sx={{ margin: 3, fontWeight: "bold" }}>
        Overall P&L:
      </Typography>
      <DataGrid
        rows={
          vehicleBenefits.filter(
            (vehicle) => vehicle.vehicleId === "xxxxxxxxxx"
          )
          // .map((vehicle) => ({
          //   ...vehicle,
          //   vin:
          //     vehicle.vin == "Total Loss" ? (
          //       <>
          //         <ThumbDownAlt color="error" /> Total Loss
          //       </>
          //     ) : vehicle.vin == "Total gains" ? (
          //       <>
          //         <ThumbUpAlt color="success" /> Total Profit
          //       </>
          //     ) : (
          //       vehicle.vin // This handles cases where vin is neither "Total Loss" nor "Total gains"
          //     ),
          // }))
        }
        columns={columns}
        getRowId={(row) => row.vin}
        loading={loading}
        autoHeight
        disableColumnMenu
      />

      <Typography variant="h5" sx={{ margin: 3, fontWeight: "bold" }}>
        Details:
      </Typography>
      <DataGrid
        rows={vehicleBenefits.filter(
          (vehicle) => vehicle.vehicleId !== "xxxxxxxxxx"
        )}
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
      />
    </Paper>
  );
};

export default BenefitsListComponent;
