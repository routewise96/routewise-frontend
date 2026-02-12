"use client"

import EventEmitter from "eventemitter3"

const eventBus = new EventEmitter()

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalEmit = eventBus.emit.bind(eventBus)
  ;(eventBus as EventEmitter & { emit: typeof originalEmit }).emit = (
    event: string,
    ...args: unknown[]
  ) => {
    if (!(window as unknown as { __ROUTEWISE_EVENTS__?: unknown[] }).__ROUTEWISE_EVENTS__) {
      (window as unknown as { __ROUTEWISE_EVENTS__: unknown[] }).__ROUTEWISE_EVENTS__ = []
    }
    ;(window as unknown as { __ROUTEWISE_EVENTS__: unknown[] }).__ROUTEWISE_EVENTS__.push({
      event,
      args,
      at: new Date().toISOString(),
    })
    return originalEmit(event, ...args)
  }
}

export { eventBus }
