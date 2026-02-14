"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { X, ImagePlus } from "lucide-react"
import Image from "next/image"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { mediaApi, postsApi } from "@/shared/api"
import { validateFile, validationConstants } from "@/features/create-post/lib/validation"

type UploadFile = {
  file: File
  preview: string
}

const { MAX_IMAGES, IMAGE_TYPES } = validationConstants

export default function CreatePostPage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return
      const remaining = MAX_IMAGES - files.length
      if (remaining <= 0) return
      const next: UploadFile[] = []
      acceptedFiles.slice(0, remaining).forEach((file) => {
        const result = validateFile(file, "image")
        if (!result.ok) {
          toast.error(result.message)
          return
        }
        next.push({ file, preview: URL.createObjectURL(file) })
      })
      if (next.length) {
        setFiles((prev) => [...prev, ...next])
      }
    },
    [files.length]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: IMAGE_TYPES.reduce<Record<string, string[]>>((acc, type) => {
      acc[type] = []
      return acc
    }, {}),
    maxFiles: MAX_IMAGES,
  })

  const canSubmit = useMemo(() => {
    return content.trim().length > 0 || files.length > 0
  }, [content, files.length])

  const handleRemove = (index: number) => {
    setFiles((prev) => {
      const next = [...prev]
      const removed = next.splice(index, 1)
      removed.forEach((item) => URL.revokeObjectURL(item.preview))
      return next
    })
  }

  const handleSubmit = async () => {
    if (!canSubmit || uploading) return
    setUploading(true)
    try {
      const uploads = await Promise.all(
        files.map((item) => mediaApi.uploadFile(item.file))
      )
      const mediaUrls = uploads.map((item) => item.fileUrl).filter(Boolean)
      await postsApi.createPost({
        content: content.trim(),
        mediaUrls: mediaUrls.length ? mediaUrls : undefined,
      })
      toast.success("Пост опубликован")
      router.push("/")
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Не удалось опубликовать пост"
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((item) => URL.revokeObjectURL(item.preview))
    }
  }, [files])

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Создать пост</h1>
            <p className="text-sm text-muted-foreground">
              Поделитесь историей и добавьте фото
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Текст поста
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Напишите что-нибудь..."
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Изображения
              </label>
              <div
                {...getRootProps()}
                className={`flex min-h-[140px] items-center justify-center rounded-xl border-2 border-dashed px-4 text-sm transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <ImagePlus className="h-6 w-6" />
                  <span>Перетащите файлы или нажмите для выбора</span>
                </div>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {files.map((item, index) => (
                    <div
                      key={`${item.preview}-${index}`}
                      className="relative overflow-hidden rounded-xl border border-border bg-muted"
                    >
                      <Image
                        src={item.preview}
                        alt=""
                        width={200}
                        height={200}
                        className="h-32 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleSubmit} disabled={!canSubmit || uploading}>
              {uploading ? "Публикация..." : "Опубликовать"}
            </Button>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
