"use client";
import { getUserVehicleVendors } from "@/actions/admin/userModule/get-user-vehicle-vendors";
import { deleteUserVendor } from "@/actions/admin/userModule/delete-user-vendor";
import React, { useEffect, useState } from "react";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import useVehicleStore from "@/states/store";
import {
  DataGrid,
  GridActionsCellItem,
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
  Tooltip,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { id } from "date-fns/locale";
import { map } from "svix/dist/openapi/rxjsStub";
import { title } from "process";

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
    getVendors();
    setLoading(false);
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

  const columns = [
    { field: "vendor", headerName: "Vendor", width: 200 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        // <Tooltip title="Delete Vendor" placement="right">
        <GridActionsCellItem
          icon={<Delete color="error" />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row.vendor)}
        />,
        // </Tooltip>
      ],
    },
  ];

  // Custom Toolbar with Export button
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Typography variant="subtitle2" fontWeight={"bold"}>
        Vendors
      </Typography>
      <DataGrid
        rows={vendors}
        loading={loading}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        components={{ Toolbar: CustomToolbar }} // Add custom toolbar
        sx={{
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
        }}
      />

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
