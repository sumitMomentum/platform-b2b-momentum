"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

// Define the type for each vehicle data item
type VehicleDataItem = {
  id: number;
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
  initialSoH: number;
  ageOfCar: number;
  estimatedDegradation: number;
  actualDegradation: number;
  difference: number;
  loss: number;
  carType: string;
};

// Replace `getAllVehicleActions` with a more specific name if possible
import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions";

interface VehicleDataListComponentProps {
  initialVehicleDataItems?: VehicleDataItem[];
}

const CustomizedDataGrid: React.FC<VehicleDataListComponentProps> = ({
  initialVehicleDataItems = [],
}) => {
  const [vehicleDataItems, setVehicleDataItems] = useState<VehicleDataItem[]>(
    initialVehicleDataItems
  );
  const [loading, setLoading] = useState(initialVehicleDataItems.length === 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllVehicleActions();
        setVehicleDataItems(data || []);
      } catch (error) {
        console.error("Failed to fetch vehicle data items", error);
      } finally {
        setLoading(false);
      }
    };

    if (initialVehicleDataItems.length === 0) {
      fetchData();
    }
  }, [initialVehicleDataItems]);

  const columns: GridColDef[] = [
    { field: "vin", headerName: "VIN", flex: 1 },
    { field: "vehicleId", headerName: "Vehicle ID", flex: 1 },
    {
      field: "batteryCycleSavingMonthly",
      headerName: "Battery Cycle Saving (Monthly)",
      flex: 1,
    },
    {
      field: "costSavingChargingMonthly",
      headerName: "Cost Saving (Monthly)",
      flex: 1,
    },
    {
      field: "rangeIncreaseMonthly",
      headerName: "Range Increase (Monthly)",
      flex: 1,
    },
    { field: "initialSoH", headerName: "Initial SoH", flex: 1 },
    { field: "ageOfCar", headerName: "Car Age (Years)", flex: 1 },
    {
      field: "estimatedDegradation",
      headerName: "Estimated Degradation (%)",
      flex: 1,
    },
    {
      field: "actualDegradation",
      headerName: "Actual Degradation (%)",
      flex: 1,
    },
    { field: "difference", headerName: "Difference (%)", flex: 1 },
    { field: "loss", headerName: "Loss", flex: 1 },
    { field: "carType", headerName: "Car Type", flex: 1 },
  ];

  return (
    <Paper sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        rows={vehicleDataItems}
        columns={columns}
        getRowId={(row) => row.id} // Use `id` for row identification
        loading={loading}
        autoHeight
        disableColumnMenu
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
      />
    </Paper>
  );
};

export default CustomizedDataGrid;
