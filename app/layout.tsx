import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/features/auth"
import { QueryProvider } from "@/app/providers/QueryProvider"
import { I18nProvider } from "@/app/providers/I18nProvider"
import { WebSocketProvider } from "@/app/providers/WebSocketProvider"
import { GeoWebSocketProvider } from "@/app/providers/GeoWebSocketProvider"

import "./globals.css"

const _inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "RouteWise - Социальная сеть путешественников",
  description:
    "Открывайте удивительные направления, делитесь приключениями и общайтесь с путешественниками со всего мира.",
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
                  <Toaster richColors position="top-right" />
                </GeoWebSocketProvider>
              </WebSocketProvider>
            </AuthProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
