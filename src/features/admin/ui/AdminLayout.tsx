"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { LayoutDashboard, Users, FileText, Flag, Activity, ListOrdered } from "lucide-react"
import { AppShell } from "@/components/AppShell"

const LINKS = [
  { href: "/admin/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/status", labelKey: "status", icon: Activity },
  { href: "/admin/events", labelKey: "events", icon: ListOrdered },
  { href: "/admin/users", labelKey: "users", icon: Users },
  { href: "/admin/posts", labelKey: "posts", icon: FileText },
  { href: "/admin/reports", labelKey: "reports", icon: Flag },
] as const

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const t = useTranslations("admin")
  return (
    <AppShell>
      <div className="container mx-auto flex gap-6 px-4 py-6">
        <nav className="hidden w-48 shrink-0 flex-col gap-1 sm:flex">
          {LINKS.map(({ href, labelKey, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t(labelKey)}
            </Link>
          ))}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </AppShell>
  )
}
