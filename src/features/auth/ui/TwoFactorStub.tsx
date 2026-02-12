"use client"

import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function TwoFactorStub() {
  const t = useTranslations("auth")
  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
      <div>
        <h3 className="font-semibold text-foreground">{t("twoFactorTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("twoFactorSubtitle")}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="2fa-code">{t("twoFactorPlaceholder")}</Label>
        <Input
          id="2fa-code"
          placeholder="000000"
          maxLength={6}
          disabled
          className="bg-background"
        />
      </div>
      <Button type="button" disabled className="w-full">
        {t("twoFactorSubmit")}
      </Button>
      <p className="text-center text-xs text-muted-foreground">{t("twoFactorStub")}</p>
    </div>
  )
}
