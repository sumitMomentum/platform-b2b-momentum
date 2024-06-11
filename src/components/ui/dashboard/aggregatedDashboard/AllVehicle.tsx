import Card from "@/components/ui/commons/Card";
import VehicleList from "@/components/ui/commons/VehicleList";
import React from "react";

const AllVehicle = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>All Vehicles</Card.Title>
        </Card.Header>
        <div className="w-full" style={{ height: "200px", overflowY: "auto" }}>
          <VehicleList />
        </div>
      </Card.Body>
    </Card>
  );
};

export default AllVehicle;
