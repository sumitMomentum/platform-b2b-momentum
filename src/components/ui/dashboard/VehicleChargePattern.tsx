import Card from "@/components/ui/commons/Card";
// import { useTranslation } from 'react-i18next';

import { useTranslations } from "next-intl";
import SocChart from "./SocChart";
import { Description } from "@radix-ui/themes/dist/esm/components/alert-dialog.js";
import { Header } from "@radix-ui/themes/dist/esm/components/table.js";
import { Title } from "@tremor/react";
// import useVehicleStore from 'store/store';
// import { useEffect } from 'react';

const VehicleChargePattern = ({
  soc,
  totalEnergyConsumed,
  averageSoC,
  connectorType,
  totalChargingSessions,
  averageChargingRate,
  dashboardData
}) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="flex items-start col-span-1 lg:col-span-1">
              <Card.Title>{t("chargingPattern")}</Card.Title>
            </div>
            <div className="border flex flex-col justify-center items-center p-2 col-span-1 lg:col-span-1">
              <Card.Description>{t("totalEnergyConsumed")}</Card.Description>
              <Card.Description>{totalEnergyConsumed} kW</Card.Description>
            </div>
          </div>
        </Card.Header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* First Column */}
          <div className="flex flex-col justify-evenly gap-4 col-span-1">
            <div>
              <Card.Description>{t("averageSoc")}</Card.Description>
              <Card.Description>{averageSoC}%</Card.Description>
            </div>
            <div>
              <Card.Description>{t("connectorType")}</Card.Description>
              <Card.Description>
                {connectorType == "Public Slow" ? "GBT" : "CCS2"}
              </Card.Description>
            </div>
          </div>

          {/* Center Chart */}
          <div className="flex justify-center col-span-1">
            <SocChart soc={soc} />
          </div>

          {/* Third Column */}
          <div className="flex flex-col justify-evenly gap-4 col-span-1 text-right">
            <div>
              <Card.Description>{t("totalChargingSessions")}</Card.Description>
              <Card.Description>{totalChargingSessions}</Card.Description>
            </div>
            <div>
              <Card.Description>{t("averageChargingRate")}</Card.Description>
              <Card.Description>
                {connectorType == "Public Slow" ? 7.8 : dashboardData.make == "Audi " ? 60 : 22} kW
              </Card.Description>
              {/* <Card.Description>{averageChargingRate} kW</Card.Description> */}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleChargePattern;
