# RouteWise — фронтенд

Социальная платформа для путешественников. Next.js 14+ (App Router), TypeScript.

## Архитектура

- **app/** — страницы и layout (Next.js App Router)
- **components/** — UI-компоненты и виджеты (Header, Sidebar, PostCard и др.)
- **src/shared/** — общий слой (FSD-style):
  - **api/** — API-клиент (axios), эндпоинты (auth, users, posts, notifications, search, bookings)
  - **lib/** — утилиты (cn), EventBus (eventemitter3)
  - **store/** — Zustand (authStore, uiStore, notificationStore)
  - **types/** — модели (User, Post, Notification и др.) и типы API
  - **hooks/** — useEventBus
- **lib/api.ts** — текущий fetch-клиент (используется в приложении)
- **app/providers/QueryProvider.tsx** — React Query (TanStack Query)

## Запуск

```bash
npm install
cp .env.example .env.local
# Отредактируйте .env.local (NEXT_PUBLIC_API_URL и др.)
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Сборка

```bash
npm run build
npm run start
```

## Переменные окружения

См. `.env.example`:

- `NEXT_PUBLIC_API_URL` — базовый URL API (по умолчанию https://routewise.ru/api)
- `NEXT_PUBLIC_SENTRY_DSN` — (опционально) DSN для Sentry
- `NEXT_PUBLIC_DEFAULT_LOCALE` — локаль по умолчанию (ru/en)

## PWA

В проекте есть `public/manifest.json`. Полноценный Service Worker через `@ducanh2912/next-pwa` можно включить при сборке через webpack: `npm run build -- --webpack` (Turbopack пока не поддерживает next-pwa).

## Технологии

- Next.js 16, React 19, TypeScript
- Tailwind CSS, shadcn/ui
- Zustand, TanStack Query (React Query), SWR
- react-hook-form, zod, sonner
- Leaflet / react-leaflet (карта)
