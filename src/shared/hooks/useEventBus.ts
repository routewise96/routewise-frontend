"use client"

import { useEffect } from "react"
import { eventBus } from "../lib/eventBus"
import type { AppEventKey } from "../lib/eventBus.constants"

export function useEventBus(event: AppEventKey, handler: (...args: unknown[]) => void) {
  useEffect(() => {
    eventBus.on(event, handler)
    return () => {
      eventBus.off(event, handler)
    }
  }, [event, handler])
}
