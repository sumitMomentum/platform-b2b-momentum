import Card from "@/components/ui/commons/Card";
import { useTranslations } from "next-intl";
import DistanceTravelledChart from "./DistanceTravelledChart";

const DistanceTravelled = () => {
  const t  = useTranslations();
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>Usage</Card.Title>
        </Card.Header>
        <div className="flex justify-evenly border mb-2">
          <DistanceTravelledChart />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t('Avg Daily Km Driven')}</Card.Description>
              <Card.Description>{t('78 km')}</Card.Description>
            </div>
            <div>
              <Card.Description>{t('Temperature Low/High')}</Card.Description>
              <Card.Description>{t('28\u00B0C / 34\u00B0C')}</Card.Description>
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t('SOC Range')}</Card.Description>
              <Card.Description>{t('30% - 95%')}</Card.Description>
            </div>
            <div>
              <Card.Description>{t('Range Observed Min/Max')}</Card.Description>
              <Card.Description>{t('87 km / 110 km')}</Card.Description>
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t('Real Range Observed')}</Card.Description>
              <Card.Description>{t('90 km')}</Card.Description>
            </div>
            <div>
              <Card.Description>
                {t('Observed vs EPA/WLTP Provided')}
              </Card.Description>
              <Card.Description>{t('90 km / 135 km')}</Card.Description>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DistanceTravelled;
