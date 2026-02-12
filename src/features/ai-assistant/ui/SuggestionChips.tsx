"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import type { AISuggestion } from "@/shared/types/models"

interface SuggestionChipsProps {
  suggestions: AISuggestion[]
  onSelect: (suggestion: AISuggestion) => void
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  const t = useTranslations("aiAssistant")

  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-xs text-muted-foreground self-center">{t("suggestions")}:</span>
      {suggestions.map((s) => (
        <Button
          key={s.id}
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-full text-xs"
          onClick={() => onSelect(s)}
        >
          {s.title}
        </Button>
      ))}
    </div>
  )
}
