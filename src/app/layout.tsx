import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { default as NextIntlClientProvider } from "next-intl";
import React from "react";
import SuspenseClerk from "@/components/suspenseSkeleton/SuspenseClerk";
import { PaletteMode, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import customTheme from "@/theme/customTheme";
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;
  const [mode, setMode] = React.useState<PaletteMode>("light");

  return (
    <ClerkProvider>
      <html lang={locale} className="antialiased">
        <body className={inter.className}>
          {/* <ClerkLoading>
            <SuspenseClerk />
          </ClerkLoading>
          <ClerkLoaded> */}
          {/* <LoadingProvider> */}
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
          </AppRouterCacheProvider>
          {/* </LoadingProvider> */}
          {/* </ClerkLoaded> */}
        </body>
        <Analytics />
      </html>
    </ClerkProvider>
  );
}
