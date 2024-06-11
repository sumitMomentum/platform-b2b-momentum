import PageName from "@/components/ui/commons/PageName";
import VehicleList from "@/components/ui/commons/VehicleList";
import AddVehicle from "@/components/ui/dashboard/AddVehicle";
import VendorList from "@/components/ui/dashboard/aggregatedDashboard/VendorList";
import { useTranslations } from "next-intl";
import React from "react";

const VehiclePage = () => {
  const t = useTranslations("AdminLayout.pages.vehicles");
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
        <div className="w-[10%] flex justify-center items-center">
          <AddVehicle />
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
