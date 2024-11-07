import { NextIntlClientProvider, useMessages } from "next-intl";
import React, { use } from "react";

export default function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = use(props.params);

  const { locale } = params;

  const { children } = props;

  const messages = useMessages();

  return (
    <div>
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
