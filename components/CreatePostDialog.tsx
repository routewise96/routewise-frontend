"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ImagePlus, X, Loader2, MapPin, Hash } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

const postSchema = z.object({
  caption: z.string().min(1, "Введите подпись к посту"),
  location: z.string().optional(),
  hashtags: z.string().optional(),
})

type PostForm = z.infer<typeof postSchema>

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostCreated?: () => void
}

export function CreatePostDialog({
  open,
  onOpenChange,
  onPostCreated,
}: CreatePostDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
  })

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    const url = URL.createObjectURL(selected)
    setPreview(url)
  }

  function removeImage() {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  function resetAll() {
    reset()
    removeImage()
  }

  async function onSubmit(data: PostForm) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      if (file) formData.append("image", file)
      formData.append("caption", data.caption)
      if (data.location) formData.append("location", data.location)
      if (data.hashtags) {
        const tags = data.hashtags
          .split(/[,\s]+/)
          .map((t) => t.replace(/^#/, "").trim())
          .filter(Boolean)
        formData.append("hashtags", JSON.stringify(tags))
      }

      await api.posts.create(formData)
      toast.success("Пост опубликован!")
      resetAll()
      onOpenChange(false)
      onPostCreated?.()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Ошибка публикации поста"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetAll()
        onOpenChange(v)
      }}
    >
      <DialogContent className="sm:max-w-lg border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Новый пост
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pt-1"
        >
          {/* Image upload */}
          <div>
            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <Image
                  src={preview}
                  alt="Предпросмотр"
                  width={600}
                  height={400}
                  className="w-full max-h-72 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-background"
                  aria-label="Удалить изображение"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border py-12 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <ImagePlus className="h-10 w-10" />
                <span className="text-sm font-medium">
                  Нажмите для загрузки фото
                </span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-caption" className="text-foreground">
              Подпись
            </Label>
            <textarea
              id="post-caption"
              placeholder="Расскажите о вашем путешествии..."
              rows={3}
              {...register("caption")}
              className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-colors"
            />
            {errors.caption && (
              <p className="text-xs text-destructive">
                {errors.caption.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="post-location"
              className="flex items-center gap-1.5 text-foreground"
            >
              <MapPin className="h-3.5 w-3.5" />
              Локация
            </Label>
            <Input
              id="post-location"
              placeholder="Бали, Индонезия"
              {...register("location")}
              className="bg-secondary border-border"
            />
          </div>

          {/* Hashtags */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="post-hashtags"
              className="flex items-center gap-1.5 text-foreground"
            >
              <Hash className="h-3.5 w-3.5" />
              Хэштеги
            </Label>
            <Input
              id="post-hashtags"
              placeholder="travel, бали, океан"
              {...register("hashtags")}
              className="bg-secondary border-border"
            />
            <p className="text-xs text-muted-foreground">
              Через запятую или пробел
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Публикация...
              </>
            ) : (
              "Опубликовать"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
