"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

interface ShortsPlayerProps {
  videoUrl: string
  isActive: boolean
  shouldLoad: boolean
}

export function ShortsPlayer({ videoUrl, isActive, shouldLoad }: ShortsPlayerProps) {
  const t = useTranslations("shorts")
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (isActive) {
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [isActive])

  if (!shouldLoad || !videoUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/80">
        <span className="text-white/60 text-sm">{t("loading")}</span>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className="absolute inset-0 h-full w-full object-cover"
      playsInline
      muted={false}
      loop
    />
  )
}
