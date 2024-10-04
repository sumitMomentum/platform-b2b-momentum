"use client";
import { createEnodeLinkSession } from "@/actions/admin/dashboardModule/create-enode-link-session";
import { Box, Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
const AddVehicle = () => {
  const router = useRouter();
  const handleAddVehicle = async () => {
    const url = await createEnodeLinkSession();
    console.log("session url", url);
    router.push(url);
  };

  return (
    <Box>
    <Button
      variant="contained"
      color="success"
      startIcon={<AddBoxIcon />}
      sx={{
        width: "150px",
        // padding: "8px 16px",
      }}
      // className="bg-green-500 w-full p-2 hover:bg-green-700 hover:text-white rounded-md"
      onClick={handleAddVehicle}
    >
      Add Vehicle
    </Button>
  </Box>
  );
};

export default AddVehicle;
