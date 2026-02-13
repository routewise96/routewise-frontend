"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { liveApi } from "@/shared/api"

export default function LiveCreatePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [streamInfo, setStreamInfo] = useState<{
    id: string
    stream_key: string
    ingest_url: string
  } | null>(null)

  const handleSubmit = async () => {
    if (!title.trim()) return
    setIsLoading(true)
    try {
      const data = await liveApi.start({
        title: title.trim(),
        description: description.trim(),
      })
      setStreamInfo(data)
      setModalOpen(true)
      toast.success("Эфир создан. Настройте OBS и запускайте трансляцию.")
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Не удалось начать эфир"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Новый эфир</h1>
            <p className="text-sm text-muted-foreground">
              Заполните данные и подключите OBS для трансляции
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Название</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название эфира"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Описание</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Коротко о трансляции"
                className="mt-2"
                rows={4}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isLoading || !title.trim()}>
              {isLoading ? "Запуск..." : "Начать эфир"}
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 text-sm text-muted-foreground">
            <h2 className="text-base font-semibold text-foreground">
              Инструкция для OBS
            </h2>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Откройте OBS Studio и перейдите в настройки трансляции.</li>
              <li>Выберите RTMP/Custom и вставьте ingest URL.</li>
              <li>В поле Stream Key вставьте ключ трансляции.</li>
              <li>Нажмите «Начать трансляцию» в OBS.</li>
            </ol>
          </div>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Параметры трансляции</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Ingest URL</p>
                <p className="break-all font-medium text-foreground">
                  {streamInfo?.ingest_url}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stream Key</p>
                <p className="break-all font-medium text-foreground">
                  {streamInfo?.stream_key}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Закрыть
              </Button>
              <Button
                onClick={() => {
                  if (streamInfo?.id) {
                    router.push(`/live/${streamInfo.id}`)
                  }
                }}
              >
                Перейти к эфиру
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppShell>
    </ProtectedRoute>
  )
}
