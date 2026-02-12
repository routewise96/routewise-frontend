"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAIChat, useAISuggestions, useAIVoiceInput } from "../hooks"
import { ChatMessage } from "./ChatMessage"
import { VoiceButton } from "./VoiceButton"
import { SuggestionChips } from "./SuggestionChips"
import type { AIMessage } from "@/shared/types/models"
import type { AISuggestion } from "@/shared/types/models"

const STORAGE_KEY = "routewise-ai-chat-history"

function loadStoredMessages(): AIMessage[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AIMessage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveMessages(messages: AIMessage[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // ignore
  }
}

export function AIChatPage() {
  const t = useTranslations("aiAssistant")
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [initialMessages, setInitialMessages] = useState<AIMessage[]>([])

  useEffect(() => {
    setInitialMessages(loadStoredMessages())
  }, [])

  const chat = useAIChat(initialMessages)
  const suggestions = useAISuggestions()
  const voice = useAIVoiceInput((text) => setInputValue(text))

  const messages = chat.messages

  useEffect(() => {
    if (chat.messages.length > 0) saveMessages(chat.messages)
  }, [chat.messages])

  const displaySuggestions =
    chat.suggestions && chat.suggestions.length > 0
      ? chat.suggestions
      : suggestions.data ?? []

  useEffect(() => {
    if (voice.transcript) setInputValue(voice.transcript)
  }, [voice.transcript])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text || chat.isPending) return
    chat.sendMessage(text)
    setInputValue("")
  }

  const handleSuggestionSelect = (s: AISuggestion) => {
    chat.sendMessage(s.title)
    if (s.action?.type === "navigate") {
      router.push("/map")
    }
  }

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col lg:h-screen">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-2xl px-4 py-6">
            <div className="flex flex-col gap-4">
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground text-sm">
                  {t("inputPlaceholder")}
                </p>
              )}
              {messages.map((m) => (
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
          </div>
        </ScrollArea>
      </div>
      <div className="border-t bg-background p-4">
        <div className="mx-auto max-w-2xl space-y-2">
          <SuggestionChips
            suggestions={displaySuggestions}
            onSelect={handleSuggestionSelect}
          />
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
              onClick={handleSend}
              disabled={!inputValue.trim() || chat.isPending}
              aria-label={t("send")}
            >
              <Send className="h-5 w-5 mr-2" />
              {t("send")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
