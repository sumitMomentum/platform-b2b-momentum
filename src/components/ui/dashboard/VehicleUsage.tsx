import { useTranslations } from "next-intl";
import Card from "../commons/Card";
import AvgDistanceChart from "./AvgDistanceChart";

const VehicleUsage = ({
  avgDailyKmDriven,
  temperatureLow,
  temperatureHigh,
  socRangeMin,
  socRangeMax,
  rangeObservedMin,
  rangeObservedMax,
  realRangeObserved,
  epaProvidedRange,
}) => {
  const t = useTranslations();
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>{t("Usage")}</Card.Title>
        </Card.Header>
        <div className="border mb-2">
          <AvgDistanceChart />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t("Avg Daily Km Driven")}</Card.Description>
              <Card.Description>{t(`${avgDailyKmDriven} km`)}</Card.Description>
            </div>
            <div>
              <Card.Description>{t("Temperature Low/High")}</Card.Description>
              <Card.Description>
                {t(`${temperatureLow}\u00B0C / ${temperatureHigh}\u00B0C`)}
              </Card.Description>
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t("SOC Range")}</Card.Description>
              <Card.Description>{t(`${socRangeMin}% - ${socRangeMax}%`)}</Card.Description>
            </div>
            <div>
              <Card.Description>{t("Range Observed Min/Max")}</Card.Description>
              <Card.Description>{t(`${rangeObservedMin} km / ${rangeObservedMax} km`)}</Card.Description>
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t("Real Range Observed")}</Card.Description>
              <Card.Description>{t(`${realRangeObserved}`)}</Card.Description>
            </div>
            <div>
              <Card.Description>
                {t("Observed vs EPA/WLTP Provided")}
              </Card.Description>
              <Card.Description>{t(`${realRangeObserved} km / ${epaProvidedRange} km`)}</Card.Description>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleUsage;
