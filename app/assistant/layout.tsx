import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI-ассистент — RouteWise",
}

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
