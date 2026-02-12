# RouteWise — фронтенд

Социальная платформа для путешественников. Next.js 16 (App Router), TypeScript.

## Технологии

- Next.js 16, React 19, TypeScript
- Tailwind CSS, shadcn/ui (Radix UI)
- Zustand (authStore и др.), TanStack Query (React Query)
- react-hook-form, zod, sonner
- next-intl (i18n ru/en)
- Leaflet / react-leaflet (карта)
- Recharts (графики в бизнес/админке)

## Структура проекта (FSD-style)

- **app/** — страницы и layout (Next.js App Router), providers
- **components/** — общие UI (Header, Sidebar, BottomNav, AppShell), shadcn/ui
- **src/features/** — фичи: auth, feed, profile, post-detail, map, notifications, bookings, shorts, ai-assistant, business, admin, settings
- **src/shared/** — api (axios, endpoints), store (Zustand), types (models, api), lib (messages, utils)
- **public/locales/** — ru/en common.json для i18n

## Доступные фичи

- **Лента** — посты, лайки, сохранение, комментарии, создание поста
- **Профиль** — просмотр и редактирование профиля, подписки
- **Карта** — места, маршруты, геолокация, встречи
- **Шорты** — вертикальное видео
- **AI-ассистент** — чат-виджет
- **Бронирования** — список и детали бронирований
- **Бизнес-кабинет** (роль business) — дашборд, аналитика, бронирования, акции, настройки компании
- **Админ-панель** (роль admin) — пользователи, посты, жалобы, статистика
- **Настройки** — профиль, безопасность (смена пароля), уведомления, язык (ru/en)

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

В проекте есть `public/manifest.json`. Service Worker через `@ducanh2912/next-pwa` можно включить при сборке через webpack: `npm run build -- --webpack` (стандартная сборка использует Turbopack, который пока не поддерживает next-pwa).
