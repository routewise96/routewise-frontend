"use client"

import type { AIMessage } from "@/shared/types/models"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: AIMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) return null

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        {message.isStreaming && (
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-current ml-1" />
        )}
      </div>
    </div>
  )
}
