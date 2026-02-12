import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Админ-панель — RouteWise",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
