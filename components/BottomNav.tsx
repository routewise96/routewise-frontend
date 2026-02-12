"use client"

import { Home, Map, CalendarDays, User, Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const BOTTOM_NAV_ITEMS = [
  { icon: Home, label: "Главная", href: "/" },
  { icon: Map, label: "Карта", href: "/map" },
  { icon: CalendarDays, label: "Брони", href: "/bookings" },
  { icon: User, label: "Профиль", href: "/profile" },
  { icon: Bell, label: "Уведомл.", href: "/notifications" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={item.label}
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
