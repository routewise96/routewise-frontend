"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  useAdminUsers,
  useBanUser,
  useUnbanUser,
  useVerifyBusiness,
} from "../hooks"
import { AdminLayout } from "./AdminLayout"
import type { User } from "@/shared/types/models"
import { toast } from "sonner"

const BanUserDialog = dynamic(() => import("./BanUserDialog").then((m) => ({ default: m.BanUserDialog })), { ssr: false })
const VerifyBusinessDialog = dynamic(() => import("./VerifyBusinessDialog").then((m) => ({ default: m.VerifyBusinessDialog })), { ssr: false })
export function UsersPage() {
  const t = useTranslations("admin")
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<string>("all")
  const [banTarget, setBanTarget] = useState<User | null>(null)
  const [verifyTarget, setVerifyTarget] = useState<User | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useAdminUsers({
    search: search || undefined,
    role: role === "all" ? undefined : role,
  })
  const users = data?.pages?.flatMap((p) => p.data ?? []) ?? []
  const banMutation = useBanUser()
  const unbanMutation = useUnbanUser()
  const verifyMutation = useVerifyBusiness()

  const handleBan = (reason: string) => {
    if (!banTarget) return
    banMutation.mutate(
      { id: String(banTarget.id), reason },
      { onSuccess: () => toast.success(t("banned")), onError: () => toast.error(t("error")), onSettled: () => setBanTarget(null) }
    )
  }

  const handleUnban = (u: User) => {
    unbanMutation.mutate(String(u.id), { onSuccess: () => toast.success(t("unbanned")), onError: () => toast.error(t("error")) })
  }

  const handleVerify = () => {
    if (!verifyTarget) return
    verifyMutation.mutate(String(verifyTarget.id), {
      onSuccess: () => toast.success(t("verified")),
      onError: () => toast.error(t("error")),
      onSettled: () => setVerifyTarget(null),
    })
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </AdminLayout>
    )
  }
  if (error) {
    return <AdminLayout><p className="text-muted-foreground">{t("error")}</p></AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("usersTitle")}</h1>
        <div className="flex flex-wrap gap-4">
          <Input placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filterAll")}</SelectItem>
              <SelectItem value="user">user</SelectItem>
              <SelectItem value="business">business</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">{t("user")}</th>
                    <th className="p-3 text-left font-medium">{t("email")}</th>
                    <th className="p-3 text-left font-medium">{t("role")}</th>
                    <th className="p-3 text-left font-medium">{t("status")}</th>
                    <th className="p-3 text-right font-medium">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={u.avatarUrl ?? u.avatar_url} />
                            <AvatarFallback>{(u.username ?? "?").slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{u.username}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{u.email}</td>
                      <td className="p-3">{u.role ?? "user"}</td>
                      <td className="p-3">{u.isVerified ? t("verified") : "-"}</td>
                      <td className="p-3 text-right">
                        {u.role === "business" && !u.isVerified && (
                          <Button variant="ghost" size="sm" onClick={() => setVerifyTarget(u)}>{t("verify")}</Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setBanTarget(u)}>{t("ban")}</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleUnban(u)}>{t("unban")}</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        {hasNextPage && (
          <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "..." : t("loadMore")}
          </Button>
        )}
      </div>
      <BanUserDialog open={!!banTarget} onOpenChange={(o) => !o && setBanTarget(null)} username={banTarget?.username} onSubmit={handleBan} isPending={banMutation.isPending} />
      <VerifyBusinessDialog open={!!verifyTarget} onOpenChange={(o) => !o && setVerifyTarget(null)} username={verifyTarget?.username} onConfirm={handleVerify} isPending={verifyMutation.isPending} />
    </AdminLayout>
  )
}
