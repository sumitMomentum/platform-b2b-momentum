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
  const t = useTranslations();

  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <div className="flex justify-between">
            <div className="flex items-start">
              <Card.Title>{t("Charging Pattern")}</Card.Title>
            </div>
            <div className="border flex flex-col justify-center items-center p-1">
              <Card.Description>{t("Total Energy Consumed")}</Card.Description>
              <Card.Description>{t(`${totalEnergyConsumed} kW`)}</Card.Description>
            </div>
          </div>
        </Card.Header>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <div>
              <Card.Description>{t("Average SoC")}</Card.Description>
              <Card.Description>{t(`${averageSoC}%`)}</Card.Description>
            </div>
            <div>
              <Card.Description>{t("Connector Type")}</Card.Description>
              <Card.Description>{t(`${connectorType}`)}</Card.Description>
            </div>
          </div>
          <div className="border">
            <SocChart soc={soc} />
          </div>
          <div className="flex flex-col justify-evenly">
            <div>
              <Card.Description>
                {t("Total Charging Sessions")}
              </Card.Description>
              <Card.Description>{t(`${totalChargingSessions}`)}</Card.Description>
            </div>
            <div>
              <Card.Description>{t("Average Charging Rate")}</Card.Description>
              <Card.Description>{t(`${averageChargingRate} kW`)}</Card.Description>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleChargePattern;
