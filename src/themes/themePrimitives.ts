import { dark } from "@clerk/themes";
import { createTheme, alpha, PaletteMode, Shadows } from "@mui/material/styles";
import { light } from "@mui/material/styles/createPalette";
import { root } from "postcss";
import style from "styled-jsx/style";
import { blue } from "tailwindcss/colors";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module "@mui/material/styles/createPalette" {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface PaletteColor extends ColorRange {}
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  main: "hsl(93, 50%, 49%)", // Base color
  50: "hsl(93, 50%, 95%)", // Lightest
  100: "hsl(93, 50%, 90%)",
  200: "hsl(93, 50%, 80%)",
  300: "hsl(93, 50%, 70%)",
  400: "hsl(93, 50%, 60%)",
  500: "hsl(93, 50%, 49%)", // Main color
  600: "hsl(93, 50%, 40%)",
  700: "hsl(93, 50%, 30%)",
  800: "hsl(93, 50%, 20%)",
  900: "hsl(93, 50%, 10%)", // Darkest
};

export const gray = {
  50: "hsl(220, 35%, 97%)",
  100: "hsl(220, 30%, 94%)",
  200: "hsl(220, 20%, 88%)",
  300: "hsl(220, 20%, 80%)",
  400: "hsl(220, 20%, 65%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 20%, 35%)",
  700: "hsl(220, 20%, 25%)",
  800: "hsl(220, 30%, 6%)",
  900: "hsl(220, 35%, 3%)",
};

export const green = {
  50: "hsl(120, 80%, 98%)",
  100: "hsl(120, 75%, 94%)",
  200: "hsl(120, 75%, 87%)",
  300: "hsl(120, 61%, 77%)",
  400: "hsl(120, 44%, 53%)",
  500: "hsl(120, 59%, 30%)",
  600: "hsl(120, 70%, 25%)",
  700: "hsl(120, 75%, 16%)",
  800: "hsl(120, 84%, 10%)",
  900: "hsl(120, 87%, 6%)",
};

export const orange = {
  50: "hsl(45, 100%, 97%)",
  100: "hsl(45, 92%, 90%)",
  200: "hsl(45, 94%, 80%)",
  300: "hsl(45, 90%, 65%)",
  400: "hsl(45, 90%, 40%)",
  500: "hsl(45, 90%, 35%)",
  600: "hsl(45, 91%, 25%)",
  700: "hsl(45, 94%, 20%)",
  800: "hsl(45, 95%, 16%)",
  900: "hsl(45, 93%, 12%)",
};

export const red = {
  50: "hsl(0, 100%, 97%)",
  100: "hsl(0, 92%, 90%)",
  200: "hsl(0, 94%, 80%)",
  300: "hsl(0, 90%, 65%)",
  400: "hsl(0, 90%, 40%)",
  500: "hsl(0, 90%, 30%)",
  600: "hsl(0, 91%, 25%)",
  700: "hsl(0, 94%, 18%)",
  800: "hsl(0, 95%, 12%)",
  900: "hsl(0, 93%, 6%)",
};

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === "dark"
      ? "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px"
      : "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px";

  return {
    palette: {
      mode,
      primary: {
        light: brand[300], // hsl(93, 50%, 70%) - Light variant
        main: brand["main"], // hsl(93, 50%, 49%) - Main color
        dark: brand[700], // hsl(93, 50%, 30%) - Dark variant
        contrastText: brand[50], // hsl(93, 50%, 95%) - Text color
        ...(mode === "dark" && {
          contrastText: brand[50], // hsl(93, 50%, 95%) - Dark mode text
          light: brand[400], // hsl(93, 50%, 60%) - Dark mode light variant
          main: brand[500], // hsl(93, 50%, 49%) - Dark mode main
          dark: brand[700], // hsl(93, 50%, 30%) - Dark mode dark variant
        }),
      },
      info: {
        light: gray[300],
        main: gray[500],
        dark: gray[700],
        contrastText: gray[50],
        ...(mode === "dark" && {
          contrastText: gray[300],
          light: gray[500],
          main: gray[700],
          dark: gray[900],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
        ...(mode === "dark" && {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
        ...(mode === "dark" && {
          light: red[400],
          main: red[500],
          dark: red[700],
        }),
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
        ...(mode === "dark" && {
          light: green[400],
          main: green[500],
          dark: green[700],
        }),
      },
      default: {
        main: brand["main"],
        contrastText: gray[1000],
      },
      grey: {
        ...gray,
      },
      divider: mode === "dark" ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
        ...(mode === "dark" && {
          default: gray[900],
          paper: "hsl(220, 30%, 7%)",
        }),
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
        ...(mode === "dark" && {
          primary: "hsl(0, 0%, 100%)",
          secondary: gray[400],
        }),
      },
      action: {
        hover: alpha(brand["main"], 0.3),
        selected: `${alpha(brand[200], 0.3)}`,
        ...(mode === "dark" && {
          hover: alpha(brand[600], 0.2),
          selected: alpha(brand[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: ['"Inter", "roboto"'].join(","),
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: customShadows,
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            minWidth: "fit-content",
            whiteSpace: "nowrap",
            fontWeight: theme.typography.fontWeightMedium,
            letterSpacing: 1,
            variants: [
              {
                props: { color: "default" }, // for buttons with color="default"
                style: ({ theme }) => ({
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    color: "white",
                    backgroundColor: theme.palette.primary.dark,
                  },
                }),
              },
            ],
          }),
        },
      },
    },
  };
};
