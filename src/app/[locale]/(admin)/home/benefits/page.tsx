"use client";

import React, { useState, useEffect } from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MainGrid from "./components/MainGrid";
import Button from "@mui/material/Button";
import PageName from "@/components/ui/commons/PageName";
import BenefitsListComponent from "./BenefitsListComponent";
import { Container } from "@mui/material";
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsightsIcon from "@mui/icons-material/Insights";

// Define BenefitItem type directly here
type BenefitItem = {
  vin: string;
  vehicleId: string;
  batteryCycleSavingMonthly: number;
  batteryCycleSavingYearly: number;
  batteryCycleSavingLifetime: number;
  costSavingChargingMonthly: number;
  costSavingChargingYearly: number;
  costSavingChargingLifeTimeEstimate: number;
  rangeIncreaseMonthly: number;
  rangeIncreaseYearly: number;
  rangeIncreaseLifetimeEstimate: number;
  revenueIncreaseLifetime: number;
};

export default function Page() {
  const [isTabular, setIsTabular] = useState<boolean>(false);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [overall, setOverall] = useState<{
    overallProfit: BenefitItem;
    overallLoss: BenefitItem;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVehicleBenefits();
        setBenefits(data.benefits || []);
        setOverall(data.overall || null);
      } catch (error) {
        console.error("Error fetching vehicle benefits data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <PageName
        name={"Benefits Dashboard"}
        breadcrumbs={[{ name: "Home", href: "/home" }]}
      />
      <Container sx={{ display: "flex", justifyContent: "right", mb: 2 }}>
        <Button
          startIcon={!isTabular ? <TableChartIcon /> : <InsightsIcon />}
          variant="contained"
          onClick={() => setIsTabular((prevState) => !prevState)}
          size="medium"
          style={{ textTransform: "none" }}
        >
          {isTabular ? "Graph View" : "Table View"}
        </Button>
      </Container>
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          mx: 3,
          pb: 5,
          mt: { xs: 8, md: 0 },
        }}
      >
        {isTabular
          ? overall && (
              <BenefitsListComponent
                benefits={benefits}
                overall={overall}
                loading={loading}
              />
            )
          : overall && (
              <MainGrid
                benefits={benefits}
                overall={overall}
                loading={loading}
                setLoading={setLoading}
              />
            )}
      </Stack>
    </Box>
  );
}
