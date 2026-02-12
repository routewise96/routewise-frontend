import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Бизнес-кабинет — RouteWise",
}

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
