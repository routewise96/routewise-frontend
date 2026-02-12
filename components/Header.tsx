"use client"

import { useState } from "react"
import { Compass, Search, Bell, Mail, LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"
import { LoginDialog } from "@/components/auth/LoginDialog"
import { RegisterDialog } from "@/components/auth/RegisterDialog"
import { Button } from "@/components/ui/button"

export function Header() {
  const { user, isLoading } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  function switchToRegister() {
    setLoginOpen(false)
    setRegisterOpen(true)
  }

  function switchToLogin() {
    setRegisterOpen(false)
    setLoginOpen(true)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Compass className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">RouteWise</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск направлений, путешественников..."
                className="w-full rounded-xl border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Поиск"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Уведомления"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </button>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Сообщения"
            >
              <Mail className="h-5 w-5" />
            </button>

            {/* Auth: avatar or login button */}
            {isLoading ? (
              <div className="ml-1 h-9 w-9 rounded-full bg-secondary animate-pulse" />
            ) : user ? (
              <Link
                href="/profile"
                className="ml-1 h-9 w-9 overflow-hidden rounded-full ring-2 ring-border transition-all hover:ring-primary"
                aria-label="Профиль"
              >
                <Image
                  src={user.avatarUrl || "https://i.pravatar.cc/150?img=1"}
                  alt="Ваш аватар"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </Link>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="ml-2"
                onClick={() => setLoginOpen(true)}
              >
                <LogIn className="mr-1.5 h-4 w-4" />
                Войти
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-border px-4 py-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск направлений, путешественников..."
                className="w-full rounded-xl border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={switchToLogin}
      />
    </>
  )
}
