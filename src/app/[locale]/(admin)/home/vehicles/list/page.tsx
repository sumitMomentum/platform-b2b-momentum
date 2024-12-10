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
  Button,
  Container,
  IconButton,
  Input,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { updateVehiclesFromCSV } from "@/actions/admin/csvModule/vehicle/update-vehicle-using-csv";
import { uploadVehiclesFromCSV } from "@/actions/admin/csvModule/vehicle/upload-vehicle-using-csv";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { type } from "os";
import style from "styled-jsx/style";
import { current } from "tailwindcss/colors";
import { Typography } from "@mui/material";

// const options = {
//   apiKey: "free",
//   maxFileCount: 1,
// };
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { title } from "process";
import { Item } from "@radix-ui/themes/dist/esm/components/checkbox-group.primitive.js";
const VehiclePage = () => {
  const t = useTranslations("AdminLayout.pages.vehicles");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
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

      const formData = new FormData();
      formData.append("file", selectedFile);

      // const result = isUpdate
      //   ? await updateVehiclesFromCSV(formData)
      //   : await uploadVehiclesFromCSV(formData);
      const result = await uploadVehiclesFromCSV(formData);

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
            <Button
              startIcon={<FileUploadIcon />}
              variant="contained"
              color="primary"
          style={{ textTransform: 'none' }}
          onClick={() => handleUpload(false)}
            >
              Onboard
            </Button>
            <Button
              startIcon={<PublishIcon />}
              variant="contained"
              color="primary"
          style={{ textTransform: 'none' }}
          onClick={() => handleUpload(true)}
            >
              Update
            </Button>
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
