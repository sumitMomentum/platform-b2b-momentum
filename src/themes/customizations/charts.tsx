import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";
import { chartColorTheme } from "../ChartPalettes"; // Import the color theme

/* eslint-disable import/prefer-default-export */
export const chartsCustomizations: Components<Theme> = {
  MuiChart: {
    styleOverrides: {
      root: ({ theme }) => ({
        // General chart styles
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        boxShadow: `0 2px 10px ${alpha(theme.palette.grey[500], 0.2)}`,
      }),
    },
  },
  MuiLineChart: {
    styleOverrides: {
      root: {
        // Apply the color theme to line charts
        colors: chartColorTheme,
      },
    },
  },
  MuiBarChart: {
    styleOverrides: {
      root: {
        // Apply the color theme to bar charts
        colors: chartColorTheme,
      },
    },
  },
};
import { grey } from "chalk";
import { root } from "postcss";
import colors from "tailwindcss/colors";
