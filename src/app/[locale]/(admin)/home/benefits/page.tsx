"use client";

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
import AppTheme from "./shared-theme/AppTheme";
import Link from "next/link";
import Button from "@mui/material/Button";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import PageName from "@/components/ui/commons/PageName";
import BenefitsListComponent from "./BenefitsListComponent";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Page(props: { disableCustomTheme?: boolean }) {
  const [isTabular, setIsTabular] = React.useState<boolean>(false);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              mt: { xs: 8, md: 0 },
              justifyContent: "space-between",
            }}
          >
            <PageName
              name={"Benefits Dashboard"}
              breadcrumbs={[{ name: "Home", href: "/home" }]}
            />
            {isTabular ? (
              <Button
                variant="contained"
                onClick={() => {
                  setIsTabular(false);
                }}
              >
                View Graphically
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  setIsTabular(true);
                }}
              >
                View Tabular
              </Button>
            )}
          </Stack>
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            {isTabular ? <BenefitsListComponent /> : <MainGrid />}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
