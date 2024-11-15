"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions";

type ActionItem = {
  id: number; // Unique ID for each action
  vehicleId: string; // ID of the vehicle associated with this action
  severity: 'High' | 'Medium' | 'Low'; // Severity level (e.g., "Medium")
  description: string; // Description of the action
  bestPractice: string; // Best practice recommendation
  actionToBeTaken: string; // Action to be taken
  confirm: number; // Confirmation count (integer)
  createdDateTime: string; // Date and time the action was created
  closedDateTime?: string; // Date and time the action was closed
};

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
    { field: 'vehicleId', headerName: 'Vehicle ID', flex: 1 },
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
          params.value ? 'bg-gray-500 hover:bg-gray-800' : 'bg-green-500 hover:bg-green-700'
        } p-2 px-8 text-white`}>
          {params.value ?  "Pending" : "Closed"}
        </button>
      )
    },
    { field: 'createdDateTime', headerName: 'Created Date', flex: 1 },
    { field: 'closedDateTime', headerName: 'Closed Date', flex: 1 },
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
