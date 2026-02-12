"use client"

import { NextIntlClientProvider } from "next-intl"
import { messages } from "@/shared/lib/messages"

const defaultLocale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as "ru" | "en") || "ru"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages[defaultLocale]}>
      {children}
    </NextIntlClientProvider>
  )
}
