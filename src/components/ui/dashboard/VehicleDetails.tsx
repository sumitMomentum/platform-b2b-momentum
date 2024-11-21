import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import { useTranslations } from "next-intl";

const VehicleDetails = ({ dashboardData }) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");

  return (
    <Card
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        padding: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <CardHeader
        title={t("vehicleInformation")}
        titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body1">
            <strong>{t("odometer")}:</strong> {dashboardData.odometerFloat}
          </Typography>
          <Typography variant="body1">
            <strong>{t("manufacturer")}:</strong> {dashboardData.make}
          </Typography>
          <Typography variant="body1">
            <strong>{t("vehicleModel")}:</strong> {dashboardData.model}
          </Typography>
          <Typography variant="body1">
            <strong>{t("modelYear")}:</strong> {dashboardData.year}
          </Typography>
          <Typography variant="body1">
            <strong>{t("vin")}:</strong> {dashboardData.vin}
          </Typography>
          <Typography variant="body1">
            <strong>{t("batteryCapacity")}:</strong>{" "}
            {dashboardData.batteryCapacity} kWh
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleDetails;
