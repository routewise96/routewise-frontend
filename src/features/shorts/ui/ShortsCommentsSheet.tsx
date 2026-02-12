"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useShortComments, useShortCreateComment } from "../hooks"
import type { Comment } from "@/shared/types/models"

interface ShortsCommentsSheetProps {
  shortId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CommentRow({ comment }: { comment: Comment }) {
  const author = comment.author?.username ?? "user"
  return (
    <div className="border-b border-border py-3 last:border-0">
      <p className="text-sm font-medium text-foreground">@{author}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{comment.content}</p>
    </div>
  )
}

export function ShortsCommentsSheet({
  shortId,
  open,
  onOpenChange,
}: ShortsCommentsSheetProps) {
  const t = useTranslations("shorts")
  const { data, isLoading } = useShortComments(shortId)
  const createComment = useShortCreateComment(shortId)
  const [content, setContent] = useState("")

  const comments = (data?.data ?? data?.items ?? []) as Comment[]
  const hasComments = Array.isArray(comments) && comments.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = content.trim()
    if (!text || !shortId || createComment.isPending) return
    try {
      await createComment.mutateAsync(text)
      setContent("")
    } catch {
      // ignore
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70dvh] flex flex-col">
        <SheetHeader>
          <SheetTitle>{t("comments")}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !hasComments ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t("noComments")}
            </p>
          ) : (
            <div className="space-y-0">
              {comments.map((c) => (
                <CommentRow key={c.id} comment={c} />
              ))}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border pt-4">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("commentPlaceholder")}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <Button type="submit" disabled={!content.trim() || createComment.isPending}>
            {createComment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("send")
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
