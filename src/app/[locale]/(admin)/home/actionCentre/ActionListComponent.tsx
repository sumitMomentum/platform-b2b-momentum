"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

type ActionItem = {
  id: number;
  vin: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  bestPractice: string;
  actionToBeTaken: string;
  confirm: boolean;
  CreatedDateTime: any;
  ClosedDateTime?: any;
};

import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions";

interface ActionListComponentProps {
  initialActionItems: ActionItem[];
}

const ActionListComponent: React.FC<ActionListComponentProps> = ({ initialActionItems }) => {
  const [actionItems, setActionItems] = useState<ActionItem[]>(initialActionItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actions = await getAllVehicleActions();
        setActionItems(actions || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch action items", error);
        setLoading(false);
      }
    };

    if (initialActionItems.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [initialActionItems]);

  const columns: GridColDef[] = [
    { field: 'vin', headerName: 'VIN', flex: 1 },
    { field: 'severity', headerName: 'Severity', flex: 1, renderCell: (params) => (
        <div className={`${
          params.value === 'High' ? 'bg-red-500 hover:bg-red-700 text-white' :
          params.value === 'Medium' ? 'bg-yellow-400 hover:bg-yellow-600 text-gray-800' :
          'bg-green-500 hover:bg-green-700 text-white'
        } px-2 py-2`}>{params.value}</div>
      )
    },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'bestPractice', headerName: 'Best Practice', flex: 2 },
    { field: 'actionToBeTaken', headerName: 'Action To be Taken', flex: 2 },
    { field: 'confirm', headerName: 'Confirm', flex: 1, renderCell: (params) => (
        <button className={`${
          params.value ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-800'
        } p-2 px-8 text-white`}>
          {params.value ? "Closed" : "Pending"}
        </button>
      )
    },
    { field: 'CreatedDateTime', headerName: 'Created Date', flex: 1, renderCell: (params) => params.value || "N/A" },
    { field: 'ClosedDateTime', headerName: 'Closed Date', flex: 1, renderCell: (params) => params.value || "N/A" },
  ];

  return (
    <Paper sx={{ height: 'auto', width: '100%' }}>
      <DataGrid
        rows={actionItems}
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

export default ActionListComponent;
