"use client"

import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useLocaleContext } from "@/app/providers/I18nProvider"

export function LanguageSettingsForm() {
  const t = useTranslations("settings")
  const currentLocale = useLocale() as "ru" | "en"
  const { setLocale } = useLocaleContext()

  return (
    <div className="space-y-4">
      <RadioGroup
        value={currentLocale}
        onValueChange={(value) => {
          if (value === "ru" || value === "en") {
            setLocale(value)
          }
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ru" id="locale-ru" />
          <Label htmlFor="locale-ru" className="cursor-pointer font-normal">
            {t("languageTab.ru")}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="en" id="locale-en" />
          <Label htmlFor="locale-en" className="cursor-pointer font-normal">
            {t("languageTab.en")}
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
