"use client"

import { useTranslations } from "next-intl"
import { Mic, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UseAIVoiceInputResult } from "../hooks"

interface VoiceButtonProps {
  voice: UseAIVoiceInputResult
  disabled?: boolean
}

export function VoiceButton({ voice, disabled }: VoiceButtonProps) {
  const t = useTranslations("aiAssistant")

  if (!voice.isSupported) {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled
        title={t("errorVoiceNotSupported")}
        aria-label={t("errorVoiceNotSupported")}
      >
        <Mic className="h-5 w-5 opacity-50" />
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size="icon"
      variant={voice.isListening ? "destructive" : "ghost"}
      disabled={disabled}
      onClick={voice.isListening ? voice.stopListening : voice.startListening}
      aria-label={voice.isListening ? t("listening") : t("voice")}
      title={voice.isListening ? t("listening") : t("voice")}
    >
      {voice.isListening ? (
        <Square className="h-5 w-5 fill-current" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  )
}
