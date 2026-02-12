"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  replyTo?: string | null
  onCancelReply?: () => void
}

export function CommentForm({
  onSubmit,
  replyTo,
  onCancelReply,
}: CommentFormProps) {
  const t = useTranslations("postDetail")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = content.trim()
    if (!text || loading) return
    setLoading(true)
    try {
      await onSubmit(text)
      setContent("")
      onCancelReply?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {replyTo && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("replyingTo", { username: replyTo })}</span>
          {onCancelReply && (
            <button type="button" onClick={onCancelReply}>
              {t("cancel")}
            </button>
          )}
        </div>
      )}
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("commentPlaceholder")}
          rows={2}
          className="min-w-0 flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          disabled={loading}
        />
        <Button type="submit" disabled={!content.trim() || loading} size="sm">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t("comment")
          )}
        </Button>
      </div>
    </form>
  )
}
