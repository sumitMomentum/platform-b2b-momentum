"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { ActionItem } from "@/types"; // Assuming you have defined ActionItem type in a separate file
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
        } px-2 py-2`}>
          {params.value}
        </div>
      )
    },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'bestPractice', headerName: 'Best Practice', flex: 1 },
    { field: 'actionToBeTaken', headerName: 'Action To be Taken', flex: 1 },
    { field: 'confirm', headerName: 'Confirm', flex: 1, renderCell: (params) => (
        <button className="bg-gray-500 p-2 px-8 hover:bg-gray-800 text-white">
          Action {params.value ? "Closed" : "Pending"}
        </button>
      )
    },
    { field: 'CreatedDateTime', headerName: 'Created Date', flex: 1, renderCell: (params) => (
        new Date(Date.parse(params.value)).toLocaleString()
      )
    },
    { field: 'ClosedDateTime', headerName: 'Closed Date', flex: 1, renderCell: (params) => (
        <div className="bg-green-600 hover:bg-green-800 text-white px-2 py-2">
          {new Date(Date.parse(params.value)).toLocaleString()}
        </div>
      )
    },
  ];

  return (
    <Paper sx={{ height: 'auto', width: '100%' }}>
      <DataGrid
        rows={actionItems}
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

export default ActionListComponent;
