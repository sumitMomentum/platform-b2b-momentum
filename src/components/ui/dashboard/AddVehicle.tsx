"use client";
import { createEnodeLinkSession } from "@/actions/admin/dashboardModule/create-enode-link-session";
import { Box, Button, Container } from "@mui/material";
import { handleEvent } from "@/utils/facades/serverFacades/enodeFacade";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import HubIcon from "@mui/icons-material/Hub";
import LoadingButton from "@mui/lab/LoadingButton";
const AddVehicle = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddVehicle = async () => {
    setLoading(true);
    const url = await createEnodeLinkSession();
    handleEvent("user:vehicle:discovered");
    console.log("session url", url);
    router.push(url);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <LoadingButton
      loading={loading}
      loadingPosition="start"
      variant="contained"
      color="primary"
      startIcon={<AddBoxIcon />}
      onClick={handleAddVehicle}
      style={{ textTransform: 'none' }}
    >
      Add
    </LoadingButton>
  );
};

export default AddVehicle;
