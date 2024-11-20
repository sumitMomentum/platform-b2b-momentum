import Card from "@mui/material/Card";
import VehicleList from "@/components/ui/commons/VehicleList";
import { Container } from "@mui/material"; // Added import
import CardContent from "@mui/material/CardContent"; // Added import
import CardHeader from "@mui/material/CardHeader"; // Added import
import Typography from "@mui/material/Typography"; // Added import
import React from "react";

const AllVehicle = () => {
  return (
    <Card>
      <CardHeader title="All Vehicles" sx={{ margin: 2 }} />
      <CardContent>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            p: 2, // Added padding
          }}
        >
          <div
            className="w-full"
            style={{ height: "300px", overflowY: "auto" }}
          >
            <VehicleList />
          </div>
        </Container>
      </CardContent>
    </Card>
  );
};

export default AllVehicle;
