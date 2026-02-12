"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { NextIntlClientProvider } from "next-intl"
import { messages } from "@/shared/lib/messages"
import type { Locale } from "@/shared/lib/messages"

const LOCALE_KEY = "NEXT_LOCALE"
const defaultLocale: Locale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale) || "ru"

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale
  const stored = localStorage.getItem(LOCALE_KEY) || document.cookie.replace(/(?:(?:^|.*;\s*)NEXT_LOCALE\s*=\s*([^;]*).*$)|^.*$/, "$1")
  if (stored === "ru" || stored === "en") return stored
  return defaultLocale
}

function setStoredLocale(locale: Locale) {
  if (typeof window === "undefined") return
  localStorage.setItem(LOCALE_KEY, locale)
  document.cookie = `${LOCALE_KEY}=${locale};path=/;max-age=31536000`
}

type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void }
const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocaleContext() {
  const ctx = useContext(LocaleContext)
  if (!ctx) return { locale: defaultLocale, setLocale: () => {} }
  return ctx
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    setLocaleState(getStoredLocale())
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    setStoredLocale(next)
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
