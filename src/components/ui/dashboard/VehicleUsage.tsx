import { useTranslations } from "next-intl";
import AvgDistanceChart from "./AvgDistanceChart";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";

const VehicleUsage = ({ dashboardData }) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  return (
    <Card>
      <CardHeader title={t("usage")} sx={{ margin: 2 }} />
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <AvgDistanceChart dashboardData={dashboardData} />
        </Box>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              {t("averageDailyKmDriven")}
            </Typography>
            <Typography>
              {(
                dashboardData.usageAverageDailyKmDriven.reduce(
                  (total, kms) => total + kms,
                  0
                ) / 12
              ).toFixed(2)}{" "}
              kms
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              {t("temperature")}
            </Typography>
            <Typography>
              {`${dashboardData.usageTemperatureLow}\u00B0C / ${dashboardData.usageTemperatureHigh}\u00B0C`}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              {t("socRange")}
            </Typography>
            <Typography>
              {`${dashboardData.usageSoCRangeMin}% - ${dashboardData.usageSoCRangeMax}%`}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              {t("rangeObservedMinMax")}
            </Typography>
            <Typography>
              {`${dashboardData.usageRangeObservedMin} kms / ${dashboardData.usageRangeObservedMax} kms`}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              {t("realRangeObserved")}
            </Typography>
            <Typography>{dashboardData.realRangeObserved} kms</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              {t("observedVsEpa")}
            </Typography>
            <Typography>
              {`${dashboardData.realRangeObserved} kms / ${dashboardData.epawltpProvidedRange} kms`}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VehicleUsage;
