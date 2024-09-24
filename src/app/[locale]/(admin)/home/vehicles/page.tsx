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
import { headers } from "next/headers";

// const options = {
//   apiKey: "free",
//   maxFileCount: 1,
// };

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
  const handleUpload = async (isUpdate) => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["xls", "xlsx"];
    if (!allowedExtensions.includes(fileExtension)) {
      alert("Please upload an Excel file (.xls or .xlsx).");
      fileInputRef.current.value = "";
      setSelectedFile(null);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const apiEndpoint = isUpdate
        ? "https://demoapi-9d35.onrender.com/api/vehicles/update/excel"
        : "https://demoapi-9d35.onrender.com/api/vehicles/onboard/excel";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true); // Set success flag to re-fetch vehicles
        window.alert(`Upload successful: ${data.message}`);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || response.statusText;
        window.alert(`Upload failed: ${errorMessage}`);
      }
    } catch (error) {
      window.alert(`Error during upload: ${error.message}`);
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
          <button
            className="bg-red-500 w-full p-2 hover:bg-red-700 text-white rounded-md"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </button>
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
            onClick={() => handleUpload(false)}
          >
            Onboard
          </button>
          <button
            className="bg-blue-500 w-full p-2 hover:bg-blue-700 hover:text-white rounded-md"
            onClick={() => {
              handleUpload(true);
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
