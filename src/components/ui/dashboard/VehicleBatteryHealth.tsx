import { useTranslations } from "next-intl";
import Card from "../commons/Card";
import SohChart from "./SohChart";

const VehicleBatteryHealth = ({
  batteryHealthSoH,
  estimatedDegradation,
  batteryChemistry,
}) => {
  const t = useTranslations();

  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <div className="flex justify-between">
            <div className="flex items-start">
              <Card.Title>{t("Battery Health")}</Card.Title>
            </div>
            {/* <div className="border p-1 flex flex-col justify-center items-center">
              <Card.Description>{t('State Of Health')}</Card.Description>
              <Card.Description>{t('100%')}</Card.Description>
            </div> */}
          </div>
        </Card.Header>
        <div className="border mb-2">
          <SohChart />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <Card.Description>{t("SoH")}</Card.Description>
            <Card.Description>{t(`${batteryHealthSoH}%`)}</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>{t("Estimated Degradation")}</Card.Description>
            <Card.Description>{t(`${estimatedDegradation}%`)}</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>{t("Battery Chemistry")}</Card.Description>
            <Card.Description>{t(`${batteryChemistry}`)}</Card.Description>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleBatteryHealth;
