"use client";

import PageName from "@/components/ui/commons/PageName";
import VehicleList from "@/components/ui/commons/VehicleList";
import AddVehicle from "@/components/ui/dashboard/AddVehicle";
import VendorList from "@/components/ui/dashboard/aggregatedDashboard/VendorList";
import { useTranslations } from "next-intl";
import { join } from "path";
import React, { useRef, useState } from "react";
import { map } from "svix/dist/openapi/rxjsStub";
import { UploadButton } from "@bytescale/upload-widget-react";
import { type } from "os";
import { ok } from "assert";
import { log, error } from "console";
import { json } from "stream/consumers";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import useVehicleStore from "@/states/store";
import { useEffect } from "react"; // Import only useEffect
import { split } from "postcss/lib/list";
import { current } from "tailwindcss/colors";

// const options = {
//   apiKey: "free",
//   maxFileCount: 1,
// };

const VehiclePage = () => {
  const t = useTranslations("AdminLayout.pages.vehicles");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false); // To track which action is being performed
  const [isSuccess, setIsSuccess] = useState(false); // To track which action is being performed
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const getVehicles = async () => {
      if (!vehicles || vehicles.length === 0 || isSuccess) {
        // Check isSuccess as well
        const userVehiclesFromDB = await getUserVehicles();
        setVehicles(userVehiclesFromDB);
        setIsSuccess(false); // Reset isSuccess after fetching new data
      }
    };

    getVehicles();
  }, [isSuccess]);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["xls", "xlsx"];
    if (!allowedExtensions.includes(fileExtension)) {
      alert("Please upload an Excel file (.xls or .xlsx).");

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the selected file
      }
      setSelectedFile(null); // Reset the selectedFile state

      return; // Stop further execution
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const apiEndpoint = isUpdate
        ? "https://demoapi-9d35.onrender.com/api/vehicles/update/excel" // Update endpoint
        : "https://demoapi-9d35.onrender.com/api/vehicles/onboard/excel"; // Onboarding endpoint

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(!isSuccess);
        window.alert(`Upload successful: ${data.message}`); // Use alert for success
      } else {
        try {
          const errorData = await response.json();
          const errorMessage = errorData.error || response.statusText;
          window.alert(`Upload failed: ${errorMessage}`);
        } catch (jsonParseError) {
          window.alert(`Upload failed: An unexpected error occurred.`);
        }
      }
    } catch (error) {
      if (error.message.includes("NetworkError")) {
        window.alert(
          "Upload failed: Network error. Please check your connection."
        );
      } else {
        window.alert(`Error during upload: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="w-full">
          <PageName
            name={t("title")}
            breadcrumbs={[
              { name: "Home", href: "/home" },
              { name: "Vehicles", href: "/home/vehicles" },
            ]}
          />
        </div>
        <div className="flex justify-center items-center gap-2">
          <AddVehicle />
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
          <input type="file" onChange={handleFileChange} />
          <button
            className="bg-green-500 w-full p-2 hover:bg-green-700 hover:text-white rounded-md"
            onClick={() => {
              handleUpload();
            }}
          >
            Onbaord
          </button>
          <button
            className="bg-green-500 w-full p-2 hover:bg-green-700 hover:text-white rounded-md"
            onClick={() => {
              handleUpload();
            }}
          >
            Update
          </button>
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
