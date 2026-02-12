"use client"

import { Home, Map, Video, CalendarDays, User, Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

const BOTTOM_NAV_ITEMS = [
  { icon: Home, labelKey: "home", href: "/" },
  { icon: Map, labelKey: "map", href: "/map" },
  { icon: Video, labelKey: "shorts", href: "/shorts" },
  { icon: CalendarDays, labelKey: "bookings", href: "/bookings" },
  { icon: User, labelKey: "profile", href: "/profile" },
  { icon: Bell, labelKey: "notifications", href: "/notifications" },
]

export function BottomNav() {
  const pathname = usePathname()
  const t = useTranslations("nav")

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const label = t(item.labelKey)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={label}
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
