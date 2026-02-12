"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { usersApi } from "@/shared/api"
import type { User } from "@/shared/types/models"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debouncedValue
}

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function MentionInput({
  value,
  onChange,
  placeholder,
  disabled,
}: MentionInputProps) {
  const t = useTranslations("createPost")
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(0)
  const debouncedQuery = useDebounce(query, 300)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!debouncedQuery.trim() || !debouncedQuery.startsWith("@")) {
      setUsers([])
      return
    }
    const q = debouncedQuery.slice(1).trim()
    if (!q) {
      setUsers([])
      return
    }
    let cancelled = false
    setLoading(true)
    usersApi
      .search(q)
      .then((data) => {
        if (!cancelled) setUsers(data.slice(0, 8))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const insertMention = useCallback(
    (username: string) => {
      const atIndex = value.lastIndexOf("@")
      if (atIndex === -1) return
      const match = value.slice(atIndex).match(/@(\S*)/)
      const queryLen = match ? match[0].length : 0
      const before = value.slice(0, atIndex)
      const after = value.slice(atIndex + queryLen)
      onChange(`${before}@${username} ${after}`)
      setQuery("")
      setUsers([])
      setOpen(false)
    },
    [value, onChange]
  )

  const handleChange = useCallback(
    (v: string) => {
      onChange(v)
      const i = v.lastIndexOf("@")
      if (i !== -1) {
        const after = v.slice(i)
        if (!/\s/.test(after)) {
          setQuery(after)
          setOpen(true)
          setCursor(0)
          return
        }
      }
      setOpen(false)
    },
    [onChange]
  )

  return (
    <div ref={wrapperRef} className="relative">
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder ?? t("captionPlaceholder")}
        disabled={disabled}
        rows={3}
        className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-colors"
      />
      {open && (users.length > 0 || loading) && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg">
          {loading ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {t("searching")}
            </li>
          ) : (
            users.map((user, index) => (
              <li key={user.id}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary ${
                    index === cursor ? "bg-secondary" : ""
                  }`}
                  onClick={() => insertMention(user.username)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl ?? user.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {(user.username || "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.username}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
