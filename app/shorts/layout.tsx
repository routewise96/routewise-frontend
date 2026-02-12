import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Шорты — RouteWise",
}

export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
