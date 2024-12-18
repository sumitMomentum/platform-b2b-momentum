import React, { ReactNode, use } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import AdminLayout from "@/components/layouts/AdminLayout";
import { ClerkLoading } from "@clerk/nextjs";
import SuspenseClerk from "@/components/suspenseSkeleton/SuspenseClerk";
// import { notFound } from "next/navigation";
// import { routing } from "@/i18n/routing";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // const params = use(props.params);

  // const { locale } = params;

  // const { children } = props;
  // // Ensure that the incoming `locale` is valid
  // if (!routing.locales.includes(locale as any)) {
  //   notFound();
  // }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
