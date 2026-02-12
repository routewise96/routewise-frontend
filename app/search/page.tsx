"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Search as SearchIcon,
  User,
  FileText,
  MapPin,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AppShell } from "@/components/AppShell"
import { api } from "@/lib/api"

interface SearchResults {
  users?: Array<Record<string, unknown>>
  posts?: Array<Record<string, unknown>>
  destinations?: Array<Record<string, unknown>>
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults>({})
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults({})
      setHasSearched(false)
      return
    }
    setIsSearching(true)
    try {
      const data = await api.search.query(q)
      // API may return { users, posts, destinations } or a flat array
      if (Array.isArray(data)) {
        setResults({ posts: data })
      } else {
        setResults({
          users: data?.users || [],
          posts: data?.posts || [],
          destinations: data?.destinations || [],
        })
      }
      setHasSearched(true)
    } catch {
      setResults({})
      setHasSearched(true)
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, performSearch])

  const users = results.users || []
  const posts = results.posts || []
  const destinations = results.destinations || []
  const totalResults = users.length + posts.length + destinations.length

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Search Input */}
        <div className="relative pb-6">
          <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск пользователей, постов, направлений..."
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            autoFocus
          />
          {isSearching && (
            <Loader2 className="absolute right-4 top-3.5 h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Results */}
        {!hasSearched && !query && (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Поиск</h2>
            <p className="text-sm text-muted-foreground">
              Найдите пользователей, посты и направления
            </p>
          </div>
        )}

        {hasSearched && totalResults === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Ничего не найдено
            </h2>
            <p className="text-sm text-muted-foreground">
              {"Попробуйте изменить запрос: \""}{query}{"\""}
            </p>
          </div>
        )}

        {/* Users */}
        {users.length > 0 && (
          <section className="pb-6">
            <div className="flex items-center gap-2 pb-3">
              <User className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Пользователи</h2>
              <span className="text-xs text-muted-foreground">({users.length})</span>
            </div>
            <div className="flex flex-col gap-1">
              {users.map((u) => (
                <Link
                  key={u.id as number}
                  href={`/profile/${u.id}`}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
                >
                  <Image
                    src={(u.avatarUrl as string) || "https://i.pravatar.cc/150?img=3"}
                    alt={(u.username as string) || "Пользователь"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {u.username as string}
                    </p>
                    {u.bio && (
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {u.bio as string}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Posts */}
        {posts.length > 0 && (
          <section className="pb-6">
            <div className="flex items-center gap-2 pb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Посты</h2>
              <span className="text-xs text-muted-foreground">({posts.length})</span>
            </div>
            <div className="flex flex-col gap-2">
              {posts.map((p) => (
                <div
                  key={p.id as number}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80"
                >
                  {(p.imageUrl as string) && (
                    <Image
                      src={p.imageUrl as string}
                      alt="Пост"
                      width={80}
                      height={80}
                      className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {(p.username as string) || (p.author as Record<string, unknown>)?.username as string || ""}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {(p.caption as string) || (p.content as string) || ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Destinations */}
        {destinations.length > 0 && (
          <section className="pb-6">
            <div className="flex items-center gap-2 pb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Направления</h2>
              <span className="text-xs text-muted-foreground">({destinations.length})</span>
            </div>
            <div className="flex flex-col gap-2">
              {destinations.map((d) => (
                <div
                  key={d.id as number}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80"
                >
                  {(d.imageUrl as string) && (
                    <Image
                      src={d.imageUrl as string}
                      alt={(d.name as string) || "Направление"}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {d.name as string}
                    </p>
                    {d.country && (
                      <p className="text-xs text-muted-foreground">{d.country as string}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
