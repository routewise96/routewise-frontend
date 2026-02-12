import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Карта — RouteWise",
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
