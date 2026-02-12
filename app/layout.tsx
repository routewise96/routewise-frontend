import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/features/auth"
import { QueryProvider } from "@/app/providers/QueryProvider"
import { I18nProvider } from "@/app/providers/I18nProvider"
import { WebSocketProvider } from "@/app/providers/WebSocketProvider"
import { GeoWebSocketProvider } from "@/app/providers/GeoWebSocketProvider"
import { AIChatWidget } from "@/features/ai-assistant"
import { Analytics } from "@/app/providers/Analytics"

import "./globals.css"

const _inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    template: "%s — RouteWise",
    default: "RouteWise — социальная платформа для путешественников",
  },
  description:
    "Планируйте путешествия, находите попутчиков, получайте AI-рекомендации.",
  openGraph: {
    title: "RouteWise",
    description: "Социальная платформа для путешественников",
    url: "https://routewise.ru",
    siteName: "RouteWise",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "ru_RU",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0b0f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${_inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <I18nProvider>
            <AuthProvider>
              <WebSocketProvider>
                <GeoWebSocketProvider>
                  {children}
                  <AIChatWidget />
                  <Toaster richColors position="top-right" />
                  <Analytics />
                </GeoWebSocketProvider>
              </WebSocketProvider>
            </AuthProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
