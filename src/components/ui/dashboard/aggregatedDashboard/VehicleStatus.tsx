import Card from "@/components/ui/commons/Card";
import React from "react";

const VehicleStatus = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>Vehicle Status</Card.Title>
        </Card.Header>
        <div className="flex flex-col gap-6 border p-6">
          {/* Active */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <Card.Description>Active</Card.Description>
            <div className="ml-auto bg-green-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
              20
            </div>
          </div>
          {/* Inactive */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <Card.Description>In-active</Card.Description>
            <div className="ml-auto bg-red-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
              15
            </div>
          </div>
          {/* Charging */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <Card.Description>Charging</Card.Description>
            <div className="ml-auto bg-yellow-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
              10
            </div>
          </div>
          {/* Out of Service */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
            <Card.Description>Out-Of-Service</Card.Description>
            <div className="ml-auto bg-gray-500 text-white rounded-xl w-8 h-6 flex justify-center items-center">
              5
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleStatus;
