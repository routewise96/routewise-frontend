"use client"

import { useState, useCallback, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { aiApi } from "@/shared/api"
import type { AIMessage } from "@/shared/types/models"

export function useAIChat(initialMessages: AIMessage[] = []) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages)
    }
  }, [initialMessages, messages.length])

  const mutation = useMutation({
    mutationFn: ({
      userContent,
      currentMessages,
    }: {
      userContent: string
      currentMessages: AIMessage[]
    }) => {
      const userMessage: AIMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userContent,
        timestamp: new Date().toISOString(),
      }
      const nextMessages = [...currentMessages, userMessage]
      setMessages(nextMessages)
      return aiApi.chat({
        messages: nextMessages,
        stream: false,
      })
    },
    onMutate: () => {
      setIsStreaming(true)
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data.message])
      setIsStreaming(false)
    },
    onError: () => {
      setIsStreaming(false)
    },
  })

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || mutation.isPending) return
      mutation.mutate({ userContent: trimmed, currentMessages: messages })
    },
    [mutation, messages]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isStreaming,
    sendMessage,
    clearMessages,
    isPending: mutation.isPending,
    suggestions: mutation.data?.suggestions,
  }
}
