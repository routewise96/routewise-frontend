"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIChatDialog } from "./AIChatDialog"

export function AIChatWidget() {
  const t = useTranslations("aiAssistant")
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-lg lg:bottom-8 lg:right-8"
        onClick={() => setOpen(true)}
        aria-label={t("widgetLabel")}
        title={t("widgetLabel")}
      >
        <Bot className="h-7 w-7" />
      </Button>
      <AIChatDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
