import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Админ-панель — RouteWise",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
