"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

// Define BenefitItem type here
type BenefitItem = {
  vin: string;
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

const CustomizedDataGrid: React.FC = () => {
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
    { field: "vin", headerName: "VIN", flex: 1, minWidth: 150 },
    { field: "batteryCycleSavingMonthly", headerName: "Battery Cycle Saving (Monthly)", flex: 1, minWidth: 200 },
    { field: "batteryCycleSavingYearly", headerName: "Battery Cycle Saving (Yearly)", flex: 1, minWidth: 200 },
    { field: "batteryCycleSavingLifetime", headerName: "Battery Cycle Saving (Lifetime)", flex: 1, minWidth: 200 },
    { field: "costSavingChargingMonthly", headerName: "Cost Saving Charging (Monthly)", flex: 1, minWidth: 200 },
    { field: "costSavingChargingYearly", headerName: "Cost Saving Charging (Yearly)", flex: 1, minWidth: 200 },
    { field: "costSavingChargingLifeTimeEstimate", headerName: "Cost Saving Charging (Lifetime Estimate)", flex: 1, minWidth: 250 },
    { field: "rangeIncreaseMonthly", headerName: "Range Increase (Monthly)", flex: 1, minWidth: 200, renderCell: (params) => (
        <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
          {params.value}
        </div>
      )
    },
    { field: "rangeIncreaseYearly", headerName: "Range Increase (Yearly)", flex: 1, minWidth: 200, renderCell: (params) => (
        <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
          {params.value}
        </div>
      )
    },
    { field: "rangeIncreaseLifetimeEstimate", headerName: "Range Increase (Lifetime Estimate)", flex: 1, minWidth: 250, renderCell: (params) => (
        <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
          {params.value}
        </div>
      )
    },
    { field: "revenueIncreaseLifetime", headerName: "Revenue Increase (Lifetime)", flex: 1, minWidth: 200, renderCell: (params) => (
        <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
          {params.value}
        </div>
      )
    },
  ];

  return (
    <Paper sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={vehicleBenefits}
        columns={columns}
        getRowId={(row) => row.vin}
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

export default CustomizedDataGrid;
