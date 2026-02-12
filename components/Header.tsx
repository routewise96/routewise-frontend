"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Compass, Search, Bell, Plus, LogIn, User, LogOut } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth, LoginDialog, RegisterDialog } from "@/features/auth"
import { CreatePostDialog } from "@/features/create-post"
import { NotificationBell } from "@/features/notifications"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onPostCreated?: () => void
}

const CREATE_POST_EVENT = "routewise:open-create-post"

export function Header({ onPostCreated }: HeaderProps = {}) {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [createPostOpen, setCreatePostOpen] = useState(false)

  useEffect(() => {
    const open = () => setCreatePostOpen(true)
    window.addEventListener(CREATE_POST_EVENT, open)
    return () => window.removeEventListener(CREATE_POST_EVENT, open)
  }, [])

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
            <Link href="/search" className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <div className="w-full rounded-xl border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-muted-foreground cursor-text">
                Поиск направлений, путешественников...
              </div>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Mobile Search */}
            <Link
              href="/search"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Поиск"
            >
              <Search className="h-5 w-5" />
            </Link>

            {user && (
              <button
                onClick={() => setCreatePostOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                aria-label="Создать пост"
              >
                <Plus className="h-5 w-5" />
              </button>
            )}

            {user ? (
              <NotificationBell />
            ) : (
              <Link
                href="/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Уведомления"
              >
                <Bell className="h-5 w-5" />
              </Link>
            )}

            {/* Auth: avatar or login button */}
            {isLoading ? (
              <div className="ml-1 h-9 w-9 rounded-full bg-secondary animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="ml-1 block h-9 w-9 overflow-hidden rounded-full ring-2 ring-border transition-all hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Меню пользователя"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt="Ваш аватар" />
                      <AvatarFallback className="text-xs font-medium bg-muted text-foreground">
                        {(user.username || "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Профиль
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onSelect={() => {
                      logout()
                      router.push("/")
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        onPostCreated={onPostCreated}
      />
    </>
  )
}
