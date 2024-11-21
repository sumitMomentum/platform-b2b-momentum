"use client";

import PageName from "@/components/ui/commons/PageName";
import VehicleList from "@/components/ui/commons/VehicleList";
import AddVehicle from "@/components/ui/dashboard/AddVehicle";
import VendorList from "@/components/ui/dashboard/aggregatedDashboard/VendorList";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import useVehicleStore from "@/states/store";
import { useEffect } from "react"; // Import only useEffect
import {
  Box,
  Button,
  Container,
  IconButton,
  Input,
  InputAdornment,
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
// const options = {
//   apiKey: "free",
//   maxFileCount: 1,
// };
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { title } from "process";
const VehiclePage = () => {
  const t = useTranslations("AdminLayout.pages.vehicles");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // To track successful operations
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const fileInputRef = useRef(null);

  // Fetch user vehicles if necessary
  const getVehicles = async () => {
    if (!vehicles || vehicles.length === 0 || isSuccess) {
      const userVehiclesFromDB = await getUserVehicles();
      setVehicles(userVehiclesFromDB);
      setIsSuccess(false);
    }
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
      const response = await fetch(
        `https://demoapi-9d35.onrender.com/api/vehicles/tempDelete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        alert(`Vehicle with ID ${data.vehicleId} deleted successfully`);
      } else {
        const errorData = await response.json();
        console.error("Error deleting vehicle:", errorData);
        alert("Error deleting vehicle");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  // Handle file upload (for onboarding or updating vehicles)
  const handleUpload = async (isUpdate: boolean) => {
    try {
      if (!selectedFile) {
        throw new Error("Please select a file to upload.");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const result = isUpdate
        ? await updateVehiclesFromCSV(formData)
        : await uploadVehiclesFromCSV(formData);

      setIsSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        (fileInputRef.current as HTMLInputElement).value = "";
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
          name={t("title")}
          breadcrumbs={[
            { name: "Home", href: "/home" },
            { name: "Vehicles", href: "/home/vehicles/list" },
          ]}
        />
      </div>
      <Box
        sx={{
          display: "flex", // Corrected spelling from "disply" to "display"
          justifyContent: "space-between", // Space between AddVehicle and the right group
          alignItems: "center", // Align all items vertically in the center
          gap: 2, // Optional: Add gap between items if needed
          margin: 2,
        }}
      >
        <AddVehicle />
        <Box
          sx={{
            display: "flex", // Corrected spelling from "disply" to "display"
            gap: 2, // Adds spacing between buttons and input
            alignItems: "center", // Align items vertically in the center
          }}
        >
          {/* <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
          /> */}
          {/* <TextField
            type="file"
            inputRef={fileInputRef}
            onChange={handleFileChange}
            // inputProps={{ accept: ".csv" }}
            placeholder="Select a csv file"
          /> */}
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              fullWidth
              label="Choose a .csv File"
              variant="outlined"
              color="primary"
              // placeholder="File name ..."
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
                    <InputAdornment position="start">
                      <Tooltip
                        title={selectedFile ? "Change File" : "Browse"}
                        placement="top"
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
              // disabled
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              style={{ display: "none" }}
            />
          </Box>
          <Button
            startIcon={<FileUploadIcon />}
            variant="contained"
            color="primary"
            onClick={() => handleUpload(false)}
          >
            Onboard
          </Button>
          <Button
            startIcon={<PublishIcon />}
            variant="contained"
            color="primary"
            onClick={() => handleUpload(true)}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={() => handleDelete()}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <div className="flex-grow flex flex-col space-y-4">
        <Box
          className="flex flex-grow overflow-auto"
          sx={{ minHeight: "50vh" }}
        >
          <VehicleList />
        </Box>
        <Box className="flex-grow h-50vh overflow-auto">
          <VendorList />
        </Box>
      </div>
    </Box>
  );
};

export default VehiclePage;
