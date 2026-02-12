import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'RouteWise - Travel Social Network',
  description: 'Discover amazing travel destinations, share your adventures, and connect with fellow travelers around the world.',
}

export const viewport: Viewport = {
  themeColor: '#0a0b0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${_inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
