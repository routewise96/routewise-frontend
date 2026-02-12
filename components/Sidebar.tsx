"use client"

import {
  Home,
  Map,
  CalendarDays,
  User,
  Settings,
  LogIn,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"

const NAV_ITEMS = [
  { icon: Home, label: "Главная", href: "/" },
  { icon: Map, label: "Карта", href: "/map" },
  { icon: CalendarDays, label: "Бронирования", href: "/bookings" },
  { icon: User, label: "Профиль", href: "/profile" },
  { icon: Settings, label: "Настройки", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  return (
    <aside className="hidden lg:flex lg:w-60 xl:w-64 flex-col fixed left-0 top-[57px] bottom-0 border-r border-border bg-background px-3 py-6">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Card */}
      <div className="mt-auto border-t border-border pt-4">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-xl px-4 py-3">
            <div className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-20 rounded bg-secondary animate-pulse" />
              <div className="mt-1 h-3 w-14 rounded bg-secondary animate-pulse" />
            </div>
          </div>
        ) : user ? (
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-secondary"
          >
            <Image
              src={user.avatarUrl || "https://i.pravatar.cc/150?img=1"}
              alt="Ваш профиль"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.username}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground">
            <LogIn className="h-5 w-5" />
            <span className="text-sm">Войдите в аккаунт</span>
          </div>
        )}
      </div>
    </aside>
  )
}
