"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  Percent,
  Settings,
} from "lucide-react"
import { AppShell } from "@/components/AppShell"

const LINKS = [
  { href: "/business/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/business/analytics", labelKey: "analytics", icon: BarChart3 },
  { href: "/business/bookings", labelKey: "bookings", icon: CalendarDays },
  { href: "/business/promotions", labelKey: "promotions", icon: Percent },
  { href: "/business/settings", labelKey: "settings", icon: Settings },
] as const

export function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const t = useTranslations("business")

  return (
    <AppShell>
      <div className="container mx-auto flex gap-6 px-4 py-6">
        <nav className="hidden w-48 shrink-0 flex-col gap-1 sm:flex">
          {LINKS.map(({ href, labelKey, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(labelKey)}
              </Link>
            )
          })}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </AppShell>
  )
}
