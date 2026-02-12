"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="ru">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
          <h1 className="text-2xl font-bold">Что-то пошло не так</h1>
          <button
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  )
}
