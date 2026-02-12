/**
 * Константы событий EventBus (shared/lib)
 */

export const APP_EVENTS = {
  AUTH_LOGOUT: "auth:logout",
  AUTH_LOGIN: "auth:login",
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_READ_ALL: "notification:read-all",
  POST_CREATED: "post:created",
  POST_LIKED: "post:liked",
  POST_UNLIKED: "post:unliked",
  POST_SAVED: "post:saved",
  POST_UNSAVED: "post:unsaved",
  FEED_REFRESH: "feed:refresh",
  GEO_UPDATE: "geo:update",
  WS_CONNECTED: "ws:connected",
  WS_DISCONNECTED: "ws:disconnected",
} as const

export type AppEventKey = (typeof APP_EVENTS)[keyof typeof APP_EVENTS]
