import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
// import { LoadingProvider } from "@/contexts/LoadingContext";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="antialiased">
      <ClerkProvider>
        {/* <LoadingProvider> */}
        <body className={inter.className}>{children}</body>
        {/* </LoadingProvider> */}
      </ClerkProvider>
      <Analytics />
    </html>
  );
}
