"use client"
import { createEnodeLinkSession } from "@/actions/admin/dashboardModule/create-enode-link-session";
import { useRouter } from "next/navigation";
import React from "react";

const AddVehicle = () => {
  const router = useRouter();
  const handleAddVehicle = async () => {
    const url = await createEnodeLinkSession();
    console.log("session url", url);
    router.push(url);
  };

  return <button className="bg-green-500 w-full p-2 hover:bg-green-700 hover:text-white rounded-md" onClick={handleAddVehicle}>Add Vehicle</button>;
};

export default AddVehicle;
