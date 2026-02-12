"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAdminPosts, useDeletePost, useHidePost } from "../hooks"
import { AdminLayout } from "./AdminLayout"
import { toast } from "sonner"

export function PostsPage() {
  const t = useTranslations("admin")
  const [search, setSearch] = useState("")
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useAdminPosts(search ? { search } : undefined)
  const posts = data?.pages?.flatMap((p) => p.data ?? []) ?? []
  const deletePost = useDeletePost()
  const hidePost = useHidePost()

  const handleDelete = (id: number) => {
    if (!confirm(t("deleteConfirm"))) return
    deletePost.mutate(String(id), { onSuccess: () => toast.success(t("deleted")), onError: () => toast.error(t("error")) })
  }
  const handleHide = (id: number) => {
    hidePost.mutate(String(id), { onSuccess: () => toast.success(t("hidden")), onError: () => toast.error(t("error")) })
  }

  if (isLoading) return <AdminLayout><div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></AdminLayout>
  if (error) return <AdminLayout><p className="text-muted-foreground">{t("error")}</p></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("postsTitle")}</h1>
        <Input placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {posts.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.username ?? "—"}</p>
                    <p className="truncate text-sm text-muted-foreground">{p.caption ?? p.text ?? ""}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleHide(p.id)}>{t("hide")}</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>{t("delete")}</Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {hasNextPage && <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>{t("loadMore")}</Button>}
      </div>
    </AdminLayout>
  )
}
