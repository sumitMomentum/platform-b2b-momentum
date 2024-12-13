"use client";

import * as React from "react";
import { PaletteMode, ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppAppBar from "./components/AppAppBar";
import Hero from "./components/Hero";
import LogoCollection from "./components/LogoCollection";
import HowWeHaveHelpedClients from "./components/HowWeHaveHelpedClients";
import Pricing from "./components/Pricing";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import WhyChooseUs from "./components/WhyChooseUs";
import Quote1 from "./components/Quote1";
import Quote2 from "./components/Quote2";
import Team from "./components/Team";
import { light } from "@mui/material/styles/createPalette";

export default function MarketingPage() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [mounted, setMounted] = React.useState(false);
  // const [showCustomTheme, setShowCustomTheme] = React.useState(true);

  // This code only runs on the client side, to determine the system color preference
  React.useEffect(() => {
    setMounted(true);
    // Check if there is a preferred mode in localStorage
    // const savedMode = localStorage.getItem("themeMode") as PaletteMode | null;
    // if (savedMode) {
    //   setMode(savedMode);
    // } else {
    //   // If no preference is found, it uses system preference
    //   const systemPrefersDark = window.matchMedia(
    //     "(prefers-color-scheme: dark)"
    //   ).matches;
    //   setMode(systemPrefersDark ? "dark" : "light");
    // }
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // const MPTheme = createTheme(getMPTheme(mode));
  // const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode); // Save the selected mode to localStorage
  };

  // const toggleCustomTheme = () => {
  //   setShowCustomTheme((prev) => !prev);
  // };

  // const theme = createTheme({
  //   palette: {
  //     primary: {
  //       main: "#77bc3f",
  //     },
  //     secondary: {
  //       main: "#E0C2FF",
  //       light: "#F5EBFF",
  //       // dark: will be calculated from palette.secondary.main,
  //       contrastText: "#47008F",
  //     },
  //   },
  // });

  return (
    <>
      {/* <ThemeProvider theme={showCustomTheme ? MPTheme : defaultTheme}> */}
      <CssBaseline enableColorScheme />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <div>
        <LogoCollection />
        <Divider />
        <Quote1 />
        <Divider />
        <Features />
        <Divider />
        {/* <Testimonials />
        <Divider /> */}
        <Divider />
        <WhyChooseUs />
        <Divider />

        <HowWeHaveHelpedClients />
        {/* <Divider />
        <Quote2 /> */}

        <Divider />
        <Team />
        <Divider />
        {/* <Pricing />
        <Divider /> */}
        {/* <FAQ />
        <Divider /> */}
        <Footer mode={mode} />
      </div>
      {/* </ThemeProvider> */}
    </>
  );
}
