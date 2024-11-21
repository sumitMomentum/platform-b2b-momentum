"use client";

import PageName from "@/components/ui/commons/PageName";
import VehicleList from "@/components/ui/commons/VehicleList";
import AddVehicle from "@/components/ui/dashboard/AddVehicle";
import VendorList from "@/components/ui/dashboard/aggregatedDashboard/VendorList";
import { useTranslations } from "next-intl";
import React, { useRef, useState, useEffect } from "react";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import { deleteVehicleById } from "@/actions/admin/userModule/delete-vehicle";
import useVehicleStore from "@/states/store";
import { Button, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { updateVehiclesFromCSV } from "@/actions/admin/csvModule/vehicle/update-vehicle-using-csv";
import { uploadVehiclesFromCSV } from "@/actions/admin/csvModule/vehicle/upload-vehicle-using-csv";

const VehiclePage = () => {
  const t = useTranslations("AdminLayout.pages.vehicles");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const fileInputRef = useRef(null);

  // Fetch user vehicles if necessary
  const getVehicles = async () => {
    if (!vehicles || vehicles.length === 0 || isSuccess) {
      const userVehiclesFromDB = await getUserVehicles();
      setVehicles(userVehiclesFromDB);
      setIsSuccess(true); // This is a major glitch causing infinite fetching
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
  const handleDelete = async (vehicleId) => {
    try {
      const result = await deleteVehicleById(vehicleId);
      setIsSuccess(true);
      alert(`Vehicle with ID ${result.vehicleId} deleted successfully`);
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
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="w-full">
          <PageName
            // name={t("title")}
            breadcrumbs={[
              { name: "Home", href: "/home" },
              { name: "Vehicles", href: "/home/vehicles/list" },
            ]}
          />
        </div>
        <div className="flex justify-center items-center gap-2">
          <AddVehicle />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
          />
          <Button
            startIcon={<FileUploadIcon />}
            variant="contained"
            color="success"
            // className="bg-green-500 w-full p-2 hover:bg-green-700 hover:text-white rounded-md"
            onClick={() => handleUpload(false)}
          >
            Onboard
          </Button>
          <Button
            startIcon={<PublishIcon />}
            variant="contained"
            color="success"
            // className="bg-blue-500 w-full p-2 hover:bg-blue-700 hover:text-white rounded-md"
            onClick={() => {
              handleUpload(true);
            }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<DeleteForeverIcon />}
            onClick={() => {
              const vehicleId = "VIN4290AUD";
              handleDelete(vehicleId);
            }}
          >
            Delete
          </Button>
          {/* <UploadButton
            options={options}
            onComplete={(files) =>
              alert(files.map((x) => x.fileUrl).join("\n"))
            }
          >
            {({ onClick }) => (
              <button onClick={onClick}>Upload a file...</button>
            )}
          </UploadButton>*/}
        </div>
      </div>
      <div className="flex-grow flex flex-col space-y-4">
        <div className="flex-grow h-[calc(50%-1rem)] overflow-auto">
          <VehicleList />
        </div>
        <div className="flex-grow h-[calc(50%-1rem)] overflow-auto">
          <VendorList />
        </div>
      </div>
    </div>
  );
};

export default VehiclePage;
