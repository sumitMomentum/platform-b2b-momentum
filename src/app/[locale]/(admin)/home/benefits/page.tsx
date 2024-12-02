"use client";

import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MainGrid from "./components/MainGrid";
import Button from "@mui/material/Button";
import PageName from "@/components/ui/commons/PageName";
import BenefitsListComponent, { BenefitItem } from "./BenefitsListComponent";
import { Container } from "@mui/material";
import { getVehicleBenefits } from "@/actions/admin/benefitsListModule/getVehicleBenefits";
import React, { useState, useEffect } from "react";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsightsIcon from "@mui/icons-material/Insights";
export default function Page() {
  const [isTabular, setIsTabular] = React.useState<boolean>(false);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVehicleBenefits();
        setBenefits(data || []);
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
        {isTabular ? (
          <BenefitsListComponent benefits={benefits} loading={loading} />
        ) : (
          <MainGrid
            benefits={benefits}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </Stack>
    </Box>
  );
}
