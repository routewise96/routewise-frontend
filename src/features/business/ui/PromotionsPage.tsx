"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
} from "../hooks"
import { BusinessLayout } from "./BusinessLayout"
import { CreatePromotionDialog } from "./CreatePromotionDialog"
import { EditPromotionDialog } from "./EditPromotionDialog"
import type { Promotion } from "@/shared/types/models"
import { toast } from "sonner"

export function PromotionsPage() {
  const t = useTranslations("business")
  const [createOpen, setCreateOpen] = useState(false)
  const [editPromo, setEditPromo] = useState<Promotion | null>(null)

  const { data: promotions = [], isLoading, error } = usePromotions()
  const createPromo = useCreatePromotion()
  const updatePromo = useUpdatePromotion()
  const deletePromo = useDeletePromotion()

  const handleCreate = (data: Omit<Promotion, "id" | "usedCount">) => {
    createPromo.mutate(data, {
      onSuccess: () => {
        setCreateOpen(false)
        toast.success(t("promoCreated"))
      },
      onError: () => toast.error(t("error")),
    })
  }

  const handleUpdate = (id: string, data: Partial<Promotion>) => {
    updatePromo.mutate(
      { id, data },
      {
        onSuccess: () => {
          setEditPromo(null)
          toast.success(t("promoUpdated"))
        },
        onError: () => toast.error(t("error")),
      }
    )
  }

  const handleDelete = (id: string) => {
    if (!confirm(t("promoDeleteConfirm"))) return
    deletePromo.mutate(id, {
      onSuccess: () => toast.success(t("promoDeleted")),
      onError: () => toast.error(t("error")),
    })
  }

  if (isLoading) {
    return (
      <BusinessLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </BusinessLayout>
    )
  }

  if (error) {
    return (
      <BusinessLayout>
        <p className="text-muted-foreground">{t("error")}</p>
      </BusinessLayout>
    )
  }

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t("promotions")}</h1>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("createPromo")}
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {promotions.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{p.title}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditPromo(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{p.description}</p>
                <p className="mt-2">
                  {p.discountType === "percentage" ? `-${p.discountValue}%` : `-${p.discountValue} ₽`} · {p.status} · {t("used")}: {p.usedCount}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {promotions.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">{t("noPromotions")}</p>
        )}
      </div>
      <CreatePromotionDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreate} isPending={createPromo.isPending} />
      {editPromo && (
        <EditPromotionDialog
          open={!!editPromo}
          onOpenChange={(open) => !open && setEditPromo(null)}
          promotion={editPromo}
          onSubmit={(data) => handleUpdate(editPromo.id, data)}
          isPending={updatePromo.isPending}
        />
      )}
    </BusinessLayout>
  )
}
