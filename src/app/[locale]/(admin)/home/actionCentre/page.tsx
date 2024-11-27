"use client";

import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MainGrid from "./components/MainGrid";
import PageName from "@/components/ui/commons/PageName";
import Button from "@mui/material/Button";
import ActionListComponent from "./ActionListComponent";
import Link from "next/link";
import { Container } from "@mui/material";
import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions";

type ActionItem = {
  id: number;
  vin: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  bestPractice: string;
  actionToBeTaken: string;
  confirm: boolean;
  CreatedDateTime: string;
  ClosedDateTime?: string;
};

export default function Page() {
  const [isTabular, setIsTabular] = React.useState<boolean>(false);
  const [actions, setActions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the actual vehicle actions data
        const data = await getAllVehicleActions();

        // If data is fetched successfully, calculate aggregates
        if (data && Array.isArray(data)) {
          setActions(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch vehicle data items", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const toggleIsTabular = () => {
    setIsTabular((prevState) => !prevState);
  };
  return (
    <Box>
      <PageName
        name={"Action Centre"}
        breadcrumbs={[{ name: "Home", href: "/home" }]}
      />
      <Container sx={{ display: "flex", justifyContent: "right", mb: 2 }}>
        <Button
          // startIcon={<ScheduleIcon />}
          variant="contained"
          onClick={() => setIsTabular((prevState) => !prevState)}
        >
          {isTabular ? "View Graphically" : "View Tabular"}
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
          <ActionListComponent actions={actions} loading={loading} />
        ) : (
          <MainGrid actions={actions} loading={loading} />
        )}
      </Stack>
    </Box>
  );
}
