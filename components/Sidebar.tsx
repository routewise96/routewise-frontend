"use client"

import {
  Home,
  Map,
  Video,
  Bot,
  CalendarDays,
  User,
  Settings,
  LogIn,
  Briefcase,
  Shield,
  Radio,
  MapPinned,
  Route,
  PlusSquare,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useAuth } from "@/features/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const NAV_ITEMS = [
  { icon: Home, labelKey: "home", href: "/" },
  { icon: PlusSquare, labelKey: "createPost", href: "/create/post" },
  { icon: Map, labelKey: "map", href: "/map" },
  { icon: MapPinned, labelKey: "stories", href: "/stories" },
  { icon: Route, labelKey: "routes", href: "/routes" },
  { icon: Radio, labelKey: "live", href: "/live" },
  { icon: Video, labelKey: "shorts", href: "/shorts" },
  { icon: Bot, labelKey: "assistant", href: "/assistant" },
  { icon: CalendarDays, labelKey: "bookings", href: "/bookings" },
  { icon: User, labelKey: "profile", href: "/profile" },
  { icon: Settings, labelKey: "settings", href: "/settings" },
]
const BUSINESS_NAV = { icon: Briefcase, labelKey: "business", href: "/business/dashboard" }
const ADMIN_NAV = { icon: Shield, labelKey: "admin", href: "/admin/dashboard" }

export function Sidebar() {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const { user, isLoading } = useAuth()
  const profileHref = user?.id ? `/profile/${user.id}` : "/profile"

  return (
    <aside className="hidden lg:flex lg:w-60 xl:w-64 flex-col fixed left-0 top-[57px] bottom-0 border-r border-border bg-background px-3 py-6">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const href = item.href === "/profile" ? profileHref : item.href
          const isActive = pathname === href
          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {t(item.labelKey)}
            </Link>
          )
        })}
        {user?.role === "business" && (
          <Link
            href={BUSINESS_NAV.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              pathname.startsWith("/business")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <BUSINESS_NAV.icon className="h-5 w-5" />
            {t(BUSINESS_NAV.labelKey)}
          </Link>
        )}
        {user?.role === "admin" && (
          <Link
            href={ADMIN_NAV.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              pathname.startsWith("/admin")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <ADMIN_NAV.icon className="h-5 w-5" />
            {t(ADMIN_NAV.labelKey)}
          </Link>
        )}
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
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt="Ваш профиль" />
              <AvatarFallback className="text-xs font-medium bg-muted text-foreground">
                {(user.username || "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
