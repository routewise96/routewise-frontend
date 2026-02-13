"use client"

import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ChatMessage } from "@/shared/api"

interface LiveChatProps {
  messages: ChatMessage[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onSend: (message: string) => Promise<void>
}

export function LiveChat({
  messages,
  isLoading,
  hasMore,
  onLoadMore,
  onSend,
}: LiveChatProps) {
  const [text, setText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = listRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
  }, [messages.length])

  const handleScroll = () => {
    if (!listRef.current || !hasMore || isLoading) return
    if (listRef.current.scrollTop <= 0) {
      onLoadMore?.()
    }
  }

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setIsSending(true)
    try {
      await onSend(trimmed)
      setText("")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-4 h-full">
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-3 pr-1"
      >
        {messages.length === 0 && !isLoading && (
          <div className="text-sm text-muted-foreground text-center py-8">
            Сообщений пока нет
          </div>
        )}
        {messages.map((msg) => {
          const avatar = msg.avatar
          const time = msg.created_at
            ? new Date(msg.created_at).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""
          return (
            <div key={msg.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-[10px] font-semibold bg-muted text-foreground">
                  {(msg.username || "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {msg.username}
                  </span>
                  <span className="text-xs text-muted-foreground">{time}</span>
                </div>
                <p className="text-sm text-foreground/90">{msg.message}</p>
              </div>
            </div>
          )
        })}
        {isLoading && (
          <div className="text-xs text-muted-foreground text-center py-2">
            Загрузка...
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать сообщение..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <Button onClick={handleSend} disabled={isSending || !text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
