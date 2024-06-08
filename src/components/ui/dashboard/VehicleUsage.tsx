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
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>{t("usage")}</Card.Title>
        </Card.Header>
        <div className="border mb-2">
          <AvgDistanceChart />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t("averageDailyKmDriven")}</Card.Description>
              <Card.Description>{avgDailyKmDriven} km</Card.Description>
            </div>
            <div>
              <Card.Description>{t("temperature")}</Card.Description>
              <Card.Description>
                {`${temperatureLow}\u00B0C / ${temperatureHigh}\u00B0C`}
              </Card.Description>
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t("socRange")}</Card.Description>
              <Card.Description>
                {`${socRangeMin}% - ${socRangeMax}%`}
              </Card.Description>
            </div>
            <div>
              <Card.Description>{t("rangeObservedMinMax")}</Card.Description>
              <Card.Description>
                {`${rangeObservedMin} km / ${rangeObservedMax} km`}
              </Card.Description>
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t("realRangeObserved")}</Card.Description>
              <Card.Description>{realRangeObserved}</Card.Description>
            </div>
            <div>
              <Card.Description>
                {t("observedVsEpa")}
              </Card.Description>
              <Card.Description>
                {`${realRangeObserved} km / ${epaProvidedRange} km`}
              </Card.Description>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleUsage;
