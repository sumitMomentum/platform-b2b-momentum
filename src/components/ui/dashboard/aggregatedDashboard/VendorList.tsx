"use client";
import { getUserVehicleVendors } from "@/actions/admin/userModule/get-user-vehicle-vendors";
import { deleteUserVendor } from "@/actions/admin/userModule/delete-user-vendor";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import useVehicleStore from "@/states/store";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const setVehicles = useVehicleStore((state) => state.setVehicles);

  const getVendors = async () => {
    const fetchedVendors = await getUserVehicleVendors();
    console.log("fetched vendors", fetchedVendors);
    setVendors(fetchedVendors.linkedVendors);
  };

  const getVehicles = async () => {
    const fetchedVehicles = await getUserVehicles();
    console.log("fetched vehicles", fetchedVehicles);
    setVehicles(fetchedVehicles);
  };

  useEffect(() => {
    getVendors();
  }, []);

  const handleDelete = async () => {
    if (selectedVendor) {
      try {
        await deleteUserVendor(selectedVendor);
        await getVendors();
        await getVehicles();
        setShowDeleteModal(false);
        setSelectedVendor(null);
        setTimeout(() => {}, 5000);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete vendor", error);
      }
    }
  };

  const handleDeleteClick = (vendor: string) => {
    setSelectedVendor(vendor);
    setShowDeleteModal(true);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
    setSelectedVendor(null);
  };

  return (
    <div className="flex w-full flex-col mt-4">
      <div className="flex flex-wrap flex-col w-full">
        <h1 className="text-lg font-medium">All Connected Vendors</h1>
        <ul>
          {vendors.map((vendor) => (
            <li
              className="group p-2 py-3 flex items-center justify-between rounded text-sm text-gray-900 cursor-pointer hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800"
              key={vendor.vendor}
            >
              {vendor.vendor}
              <button
                className="bg-red-500 p-1 rounded-full transform transition-transform duration-100 ease-in-out hover:bg-red-700 hover:scale-110 hover:shadow-lg"
                onClick={() => handleDeleteClick(vendor.vendor)}
              >
                <TrashIcon className="h-4 w-4 text-white" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedVendor}?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-400"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;
