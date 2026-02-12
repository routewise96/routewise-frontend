"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAIChat, useAISuggestions, useAIVoiceInput } from "../hooks"
import { ChatMessage } from "./ChatMessage"
import { VoiceButton } from "./VoiceButton"
import { SuggestionChips } from "./SuggestionChips"
import type { AISuggestion } from "@/shared/types/models"

interface AIChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIChatDialog({ open, onOpenChange }: AIChatDialogProps) {
  const t = useTranslations("aiAssistant")
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const chat = useAIChat()
  const suggestions = useAISuggestions()
  const voice = useAIVoiceInput((text) => setInputValue(text))

  const displaySuggestions =
    chat.suggestions?.length
      ? chat.suggestions
      : suggestions.data ?? []

  useEffect(() => {
    if (voice.transcript) setInputValue(voice.transcript)
  }, [voice.transcript])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat.messages])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text || chat.isPending) return
    chat.sendMessage(text)
    setInputValue("")
  }

  const handleSuggestionSelect = (s: AISuggestion) => {
    chat.sendMessage(s.title)
    if (s.action?.type === "navigate") {
      onOpenChange(false)
      window.location.href = "/map"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="min-h-[200px] max-h-[50vh] flex-1 px-1">
          <div className="flex flex-col gap-3 py-4">
            {chat.messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {chat.isStreaming && (
              <div className="flex justify-start">
                <span className="rounded-2xl bg-muted px-4 py-2 text-sm text-muted-foreground">
                  {t("assistantThinking")}
                </span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        <div className="space-y-2 border-t pt-4">
          <SuggestionChips suggestions={displaySuggestions} onSelect={handleSuggestionSelect} />
          <div className="flex gap-2">
            <VoiceButton voice={voice} disabled={chat.isPending} />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("inputPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim() || chat.isPending}
              aria-label={t("send")}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
