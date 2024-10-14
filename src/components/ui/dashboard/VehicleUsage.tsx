import { useTranslations } from "next-intl";
import Card from "../commons/Card";
import AvgDistanceChart from "./AvgDistanceChart";
import { Box, Container } from "@mui/material";

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
  dashboardData,
}) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");
  console.log(dashboardData)
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>{t("usage")}</Card.Title>
        </Card.Header>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <AvgDistanceChart dashboardData={dashboardData} />
        </Container>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t("averageDailyKmDriven")}</Card.Description>
              {/* <Card.Description>{avgDailyKmDriven} km</Card.Description> */}
              <Card.Description>
                {(
                  dashboardData.UsageAverageDailyKmDriven.reduce(
                    (total, kms) => {
                      return (total = total + kms);
                    },
                    0
                  ) / 12
                ).toFixed(2)}{" "}
                kms
              </Card.Description>
            </div>
            <div>
              <Card.Description>{t("temperature")}</Card.Description>
              <Card.Description>
                {`${dashboardData.UsageTemperatureLow}\u00B0C / ${dashboardData.UsageTemperatureHigh}\u00B0C`}
              </Card.Description>
              {/* <Card.Description>
                {`${temperatureLow}\u00B0C / ${temperatureHigh}\u00B0C`}
              </Card.Description> */}
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t("socRange")}</Card.Description>
              <Card.Description>
                {`${dashboardData.UsageSoCRangeMin}% - ${dashboardData.UsageSoCRangeMax}%`}
              </Card.Description>
              {/* <Card.Description>
                {`${socRangeMin}% - ${socRangeMax}%`}
              </Card.Description> */}
            </div>
            <div>
              <Card.Description>{t("rangeObservedMinMax")}</Card.Description>
              <Card.Description>
                {`${dashboardData.UsageRangeObservedMin} kms / ${dashboardData.UsageRangeObservedMax} kms`}
              </Card.Description>
              {/* <Card.Description>
                {`${rangeObservedMin} km / ${rangeObservedMax} km`}
              </Card.Description> */}
            </div>
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="mb-2">
              <Card.Description>{t("realRangeObserved")}</Card.Description>
              {/* <Card.Description>{realRangeObserved}</Card.Description> */}
              <Card.Description>
                {dashboardData.RealRangeObserved} kms
              </Card.Description>
            </div>
            <div>
              <Card.Description>{t("observedVsEpa")}</Card.Description>
              <Card.Description>
                {`${dashboardData.RealRangeObserved} kms / ${dashboardData.EPAWLTPProvidedRange} kms"`}
                {/* {`${realRangeObserved} km / ${epaProvidedRange} km`} */}
              </Card.Description>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleUsage;
