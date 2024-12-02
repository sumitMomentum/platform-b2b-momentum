"use client";
import { getUserVehicleVendors } from "@/actions/admin/userModule/get-user-vehicle-vendors";
import { deleteUserVendor } from "@/actions/admin/userModule/delete-user-vendor";
import React, { useEffect, useState } from "react";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import useVehicleStore from "@/states/store";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { id, mt } from "date-fns/locale";
import { map } from "svix/dist/openapi/rxjsStub";
import { title } from "process";
import { type } from "os";
import path from "path";
import { rows } from "@/app/[locale]/(admin)/home/actionCentre/internals/data/gridData";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const setVehicles = useVehicleStore((state) => state.setVehicles);

  const getVendors = async () => {
    const fetchedVendors = await getUserVehicleVendors();
    const vendorsWithIds = fetchedVendors.linkedVendors.map(
      (vendor, index) => ({
        id: index, // Assign a unique ID to each vendor
        ...vendor,
      })
    );
    setVendors(vendorsWithIds);
  };

  const getVehicles = async () => {
    const fetchedVehicles = await getUserVehicles();
    setVehicles(fetchedVehicles);
  };

  useEffect(() => {
    setLoading(true);
    getVendors().then(() => {
      setLoading(false); // Set loading to false after fetching vendors
    });
    console.log(vendors);
  }, []);

  const handleDelete = async (vendor) => {
    setDeleteLoading(true);
    try {
      await deleteUserVendor(vendor);
      await getVendors();
      await getVehicles();
      setShowDeleteModal(false);
      setSelectedVendor(null);
    } catch (error) {
      console.error("Failed to delete vendor", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteClick = (vendor) => {
    setSelectedVendor(vendor);
    setShowDeleteModal(true);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
    setSelectedVendor(null);
  };

  const columns: GridColDef[] = [
    { field: "vendor", headerName: "Vendor", width: 200 },
    {
      field: "actions",
      type: "actions", // Ensure type is "actions"
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="delete"
          icon={<Delete color="error" />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row.vendor)} // Call delete handler
        />,
      ],
    },
  ];

  const paginationModel = {
    page: 0,
    pageSize: 3,
  };

  // Custom Toolbar with Export button
  // function CustomToolbar() {
  //   return (
  //     <GridToolbarContainer>
  //       <GridToolbarExport />
  //     </GridToolbarContainer>
  //   );
  // }

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Typography variant="subtitle2" fontWeight={"bold"}>
        Vendors
      </Typography>
      {vendors.length > 0 ? (
        <DataGrid
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
          // slots={{
          //   noRowsOverlay: CustomNoRowsOverlay,
          // }}
          rows={vendors}
          getRowId={(row) => row.vendor}
          loading={loading}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[3, 5, 10]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
          }}
        />
      ) : (
        <Typography
          variant="subtitle2"
          fontWeight={"bold"}
          sx={{ width: "100%", margin: 2, justifyContent: "center" }}
        >
          No Vendors Found
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onClose={handleCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedVendor}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <LoadingButton
            onClick={() => handleDelete(selectedVendor)}
            color="error"
            loading={deleteLoading}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorList;

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .no-rows-primary": {
    fill: "#3D4751",
    ...theme.applyStyles("light", {
      fill: "#AEB8C2",
    }),
  },
  "& .no-rows-secondary": {
    fill: "#1D2126",
    ...theme.applyStyles("light", {
      fill: "#E8EAED",
    }),
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 452 257"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-rows-primary"
          d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
        />
        <path
          className="no-rows-secondary"
          d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
        />
      </svg>
      <Box sx={{ mt: 2 }}>No rows</Box>
    </StyledGridOverlay>
  );
}
