import { useTranslations } from "next-intl";
import Card from "../commons/Card";
import SohChart from "./SohChart";

const VehicleBatteryHealth = ({
  batteryHealthSoH,
  estimatedDegradation,
  batteryChemistry,
}) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <div className="flex justify-between">
            <div className="flex items-start">
              <Card.Title>{t("batteryHealth")}</Card.Title>
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
            <Card.Description>{t("soh")}</Card.Description>
            <Card.Description>{`${batteryHealthSoH}%`}</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>{t("estimatedDegradation")}</Card.Description>
            <Card.Description>{`${estimatedDegradation}%`}</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>{t("batteryChemistry")}</Card.Description>
            <Card.Description>{batteryChemistry}</Card.Description>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleBatteryHealth;
