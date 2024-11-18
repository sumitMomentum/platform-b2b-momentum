"use client";
import React, { useEffect, useState } from "react";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { default as NextIntlClientProvider } from "next-intl";
import SuspenseClerk from "@/components/suspenseSkeleton/SuspenseClerk";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import getMPTheme from "@/themes/getMPTheme";
const inter = Inter({ subsets: ["latin"] });
import { PaletteMode, ThemeProvider, createTheme } from "@mui/material/styles";

export default function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [locale, setLocale] = React.useState<string | undefined>(undefined); // State for locale

  React.useEffect(() => {
    const fetchParams = async () => {
      const params = await props.params; // Await the params promise
      setLocale(params.locale); // Set the locale state
    };
    fetchParams();
  }, [props.params]);

  const { children } = props;
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);

  React.useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem("themeMode") as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const MPTheme = createTheme(getMPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode); // Save the selected mode to localStorage
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  return (
    <ClerkProvider>
      <html lang={locale} className="antialiased">
        <body className={inter.className}>
          {/* <ClerkLoading>
            <SuspenseClerk />
          </ClerkLoading>
          <ClerkLoaded> */}
          {/* <LoadingProvider> */}
          <AppRouterCacheProvider>
            <ThemeProvider theme={true ? MPTheme : defaultTheme}>
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
          {/* </LoadingProvider> */}
          {/* </ClerkLoaded> */}
        </body>
        <Analytics />
      </html>
    </ClerkProvider>
  );
}
