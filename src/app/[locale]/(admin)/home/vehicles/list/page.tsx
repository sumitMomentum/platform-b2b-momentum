"use client";

import PageName from "@/components/ui/commons/PageName";
import VehicleList from "@/components/ui/commons/VehicleList";
import AddVehicle from "@/components/ui/dashboard/AddVehicle";
import VendorList from "@/components/ui/dashboard/aggregatedDashboard/VendorList";
import { useTranslations } from "next-intl";
import React, { useRef, useState, useEffect } from "react";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import { deleteAllVehiclesAndBenefits } from "@/actions/admin/userModule/delete-vehicle";
import useVehicleStore from "@/states/store";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Button
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { updateVehiclesFromCSV } from "@/actions/admin/csvModule/vehicle/update-vehicle-using-csv";
import { uploadVehiclesFromCSV } from "@/actions/admin/csvModule/vehicle/upload-vehicle-using-csv";

const VehiclePage = () => {
  const t = useTranslations("AdminLayout.pages.vehicles");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState({ onboard: false, update: false });
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const fileInputRef = useRef(null);
  // Fetch user vehicles if necessary
  const getVehicles = async () => {
    const userVehiclesFromDB = await getUserVehicles();
    setVehicles(userVehiclesFromDB);
    setIsSuccess(false);
  };

  useEffect(() => {
    getVehicles();
  }, [isSuccess]); // Re-fetch vehicles after a successful operation

  // Handle file input change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle deletion of vehicles
  const handleDelete = async () => {
    try {
      const result = await deleteAllVehiclesAndBenefits();
      setIsSuccess(true);
      alert(`All Vehicles removed successfully`);
      getVehicles(); // Re-fetch vehicles after deletion
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Error deleting vehicle");
    }
  };

  // Handle file upload (for onboarding or updating vehicles)
  const handleUpload = async (isUpdate) => {
    try {
      if (!selectedFile) {
        throw new Error("Please select a file to upload.");
      }

      setLoading((prev) => ({ ...prev, [isUpdate ? 'update' : 'onboard']: true }));

      const formData = new FormData();
      formData.append("file", selectedFile);

      const result = isUpdate
        ? await updateVehiclesFromCSV(formData)
        : await uploadVehiclesFromCSV(formData);

      setIsSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      window.alert(
        `${isUpdate ? "Update" : "Upload"} successful: ${result.message}`
      );
    } catch (error) {
      console.error("Upload error:", error);
      window.alert(
        `Error: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [isUpdate ? 'update' : 'onboard']: false }));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box>
      <div className="w-full">
        <PageName
          name={"Vehicles"}
          breadcrumbs={[{ name: "Home", href: "/home" }]}
        />
      </div>
      <Box
        sx={{
          display: { xs: "block", sm: "flex" }, // Responsive display
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          margin: 2,
        }}
      >
        <AddVehicle />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box>
            <TextField
              fullWidth
              label="Choose a .csv File"
              variant="outlined"
              color="primary"
              size="small"
              sx={{
                "& .MuiInputBase-input": {
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                },
              }}
              value={fileInputRef.current?.files?.[0]?.name || ""}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        title={selectedFile ? "Change File" : "Browse"}
                        placement="bottom"
                        color="primary"
                        slotProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "primary.main",
                              "& .MuiTooltip-arrow": {
                                color: "primary",
                              },
                            },
                          },
                        }}
                      >
                        <IconButton
                          color="primary"
                          onClick={handleButtonClick}
                          size="small"
                        >
                          {selectedFile ? (
                            <ChangeCircleIcon />
                          ) : (
                            <AddCircleIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              style={{ display: "none" }}
            />
          </Box>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="row"
            useFlexGap
            sx={{ flexWrap: "wrap" }}
          >
            <LoadingButton
              startIcon={<FileUploadIcon />}
              loading={loading.onboard}
              loadingPosition="start"
              variant="contained"
              color="primary"
              style={{ textTransform: 'none' }}
              onClick={() => handleUpload(false)}
            >
              Onboard
            </LoadingButton>
            <LoadingButton
              startIcon={<PublishIcon />}
              loading={loading.update}
              loadingPosition="start"
              variant="contained"
              color="primary"
              style={{ textTransform: 'none' }}
              onClick={() => handleUpload(true)}
            >
              Update
            </LoadingButton>
            <Button
              variant="outlined"
              color="error"
              style={{ textTransform: 'none' }}
              startIcon={<DeleteForeverIcon />}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box className="flex-grow flex flex-col space-y-4">
        <Box>
          <VehicleList />
        </Box>
        <Box>
          <VendorList />
        </Box>
      </Box>
    </Box>
  );
};

export default VehiclePage;
