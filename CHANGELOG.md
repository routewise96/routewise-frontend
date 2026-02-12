# Changelog

Все заметные изменения в проекте RouteWise описаны в этом файле. Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).

## [Unreleased]

- PWA (next-pwa), офлайн-страница, манифест
- SEO: метаданные страниц, robots.txt, sitemap
- Мониторинг: Sentry, Vercel Analytics
- E2E: Cypress, чек-лист смок-тестов (SMOKE_TEST.md)
- Документация: README, CHANGELOG

## [0.7.0] — Финальная оптимизация

- Динамический импорт модалок админки (производительность)
- Bundle analyzer для анализа чанков
- Отключение Turbopack в dev для совместимости с PWA

## [0.6.0] — Настройки пользователя

- Страница настроек: профиль, безопасность, уведомления, язык
- Unit-тесты для форм настроек (Jest)

## [0.5.0] — Админ-панель

- Дашборд, пользователи, посты, жалобы
- Бан пользователя, верификация бизнеса, разрешение жалоб
- Unit-тесты для админ-хуков и страниц

## [0.4.0] — AI и Бизнес

- AI-ассистент (чат-виджет)
- Бизнес-кабинет: дашборд, бронирования, акции, настройки компании

## [0.3.0] — Real-time и Гео

- WebSocket-провайдеры, геолокация, карта (Leaflet)
- Встречи и маршруты на карте

## [0.2.0] — Ядро платформы

- Лента, профиль, посты, комментарии, лайки
- Бронирования, шорты, уведомления
- next-intl (ru/en)

## [0.1.0] — Фундамент

- Next.js 16 (App Router), TypeScript, Tailwind, shadcn/ui
- Auth (логин/регистрация), Zustand, TanStack Query
- Базовая структура (FSD-style), API-клиент

[Unreleased]: https://github.com/your-org/routewise-frontend/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/your-org/routewise-frontend/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/your-org/routewise-frontend/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/your-org/routewise-frontend/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/your-org/routewise-frontend/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/your-org/routewise-frontend/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/your-org/routewise-frontend/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/your-org/routewise-frontend/releases/tag/v0.1.0
