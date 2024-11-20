"use client";
import { createEnodeLinkSession } from "@/actions/admin/dashboardModule/create-enode-link-session";
import { Box, Button, Container } from "@mui/material";
import { handleEvent } from "@/utils/facades/serverFacades/enodeFacade";
import { useRouter } from "next/navigation";
import React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import HubIcon from "@mui/icons-material/Hub";
const AddVehicle = () => {
  const router = useRouter();

  const handleAddVehicle = async () => {
    const url = await createEnodeLinkSession();
    handleEvent("user:vehicle:discovered");
    console.log("session url", url);
    router.push(url);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<HubIcon />}
      onClick={handleAddVehicle}
    >
      Enode Add Vehicle
    </Button>
  );
};

export default AddVehicle;
