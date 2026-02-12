"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import {
  useShortsFeed,
  useShortLike,
  useShortUnlike,
  useShortSave,
  useShortUnsave,
  useShortRepost,
} from "../hooks"
import { normalizeShort } from "../lib/normalizeShort"
import { ShortsSlide } from "./ShortsSlide"
import { ShortsCommentsSheet } from "./ShortsCommentsSheet"
import { toast } from "sonner"

export function ShortsFeed() {
  const t = useTranslations("shorts")
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [commentShortId, setCommentShortId] = useState<number | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useShortsFeed()

  const shorts = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((p) => (p.data ?? p.posts ?? [])).map(normalizeShort)
  }, [data])

  const likeMutation = useShortLike()
  const unlikeMutation = useShortUnlike()
  const saveMutation = useShortSave()
  const unsaveMutation = useShortUnsave()
  const repostMutation = useShortRepost()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number(entry.target.getAttribute("data-short-index"))
          if (!Number.isNaN(index)) setActiveIndex(index)
        }
      },
      { threshold: 0.5, root: container }
    )

    const slides = container.querySelectorAll("[data-short-index]")
    slides.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [shorts.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollHeight - scrollTop - clientHeight < 300 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleLike = useCallback(
    (shortId: number, liked: boolean) => {
      if (liked) {
        unlikeMutation.mutate(shortId, { onError: () => toast.error(t("errorLike")) })
      } else {
        likeMutation.mutate(shortId, { onError: () => toast.error(t("errorLike")) })
      }
    },
    [likeMutation, unlikeMutation, t]
  )

  const handleSave = useCallback(
    (shortId: number, saved: boolean) => {
      if (saved) {
        unsaveMutation.mutate(shortId, { onError: () => toast.error(t("errorSave")) })
      } else {
        saveMutation.mutate(shortId, { onError: () => toast.error(t("errorSave")) })
      }
    },
    [saveMutation, unsaveMutation, t]
  )

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <p className="text-muted-foreground">{t("error")}</p>
      </div>
    )
  }

  if (isLoading || shorts.length === 0) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        {isLoading ? (
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        ) : (
          <p className="text-muted-foreground">{t("noShorts")}</p>
        )}
      </div>
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {shorts.map((short, index) => (
          <div
            key={short.id}
            data-short-index={index}
            className="min-h-[100dvh] w-full snap-start snap-always"
          >
            <ShortsSlide
              short={short}
              isActive={activeIndex === index}
              shouldLoad={index <= activeIndex + 1}
              onLike={() => handleLike(short.id, short.liked)}
              onComment={() => setCommentShortId(short.id)}
              onSave={() => handleSave(short.id, short.saved)}
              onRepost={() => repostMutation.mutate(short.id)}
            />
          </div>
        ))}
        {isFetchingNextPage && (
          <div className="flex min-h-[100dvh] snap-start items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <ShortsCommentsSheet
        shortId={commentShortId}
        open={commentShortId != null}
        onOpenChange={(open) => !open && setCommentShortId(null)}
      />
    </>
  )
}
