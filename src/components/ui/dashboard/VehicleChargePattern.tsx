import Card from "@/components/ui/commons/Card";
// import { useTranslation } from 'react-i18next';

import { useTranslations } from "next-intl";
import SocChart from "./SocChart";
// import useVehicleStore from 'store/store';
// import { useEffect } from 'react';

const VehicleChargePattern = ({
  soc,
  totalEnergyConsumed,
  averageSoC,
  connectorType,
  totalChargingSessions,
  averageChargingRate,
}) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <div className="flex justify-between">
            <div className="flex items-start">
              <Card.Title>{t("chargingPattern")}</Card.Title>
            </div>
            <div className="border flex flex-col justify-center items-center p-1">
              <Card.Description>{t("totalEnergyConsumed")}</Card.Description>
              <Card.Description>{totalEnergyConsumed} kW</Card.Description>
            </div>
          </div>
        </Card.Header>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <div>
              <Card.Description>{t("averageSoc")}</Card.Description>
              <Card.Description>{averageSoC}%</Card.Description>
            </div>
            <div>
              <Card.Description>{t("connectorType")}</Card.Description>
              <Card.Description>{connectorType}</Card.Description>
            </div>
          </div>
          <div className="border">
            <SocChart soc={soc} />
          </div>
          <div className="flex flex-col justify-evenly">
            <div>
              <Card.Description>
                {t("totalChargingSessions")}
              </Card.Description>
              <Card.Description>{totalChargingSessions}</Card.Description>
            </div>
            <div>
              <Card.Description>{t("averageChargingRate")}</Card.Description>
              <Card.Description>{averageChargingRate} kW</Card.Description>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleChargePattern;
