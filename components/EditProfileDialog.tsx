"use client"

import { useState, useRef, useEffect, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth/AuthProvider"
import { api } from "@/lib/api"

const profileSchema = z.object({
  username: z.string().min(2, "Минимум 2 символа"),
  bio: z.string().max(200, "Максимум 200 символов").optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdated?: () => void
}

export function EditProfileDialog({
  open,
  onOpenChange,
  onProfileUpdated,
}: EditProfileDialogProps) {
  const { user, setUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      bio: user?.bio || "",
    },
  })

  useEffect(() => {
    if (open && user) {
      reset({ username: user.username, bio: user.bio || "" })
      setPreview(null)
      setFile(null)
    }
  }, [open, user, reset])

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  async function onSubmit(data: ProfileForm) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("username", data.username)
      if (data.bio) formData.append("bio", data.bio)
      if (file) formData.append("avatar", file)

      const updated = await api.users.updateMe(formData)
      if (updated && user) {
        const newUser = {
          ...user,
          username: updated.username || data.username,
          bio: updated.bio || data.bio,
          avatarUrl: updated.avatarUrl || updated.avatar_url || user.avatarUrl,
        }
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
      }
      toast.success("Профиль обновлён!")
      onOpenChange(false)
      onProfileUpdated?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка обновления")
    } finally {
      setIsSubmitting(false)
    }
  }

  const avatarSrc = preview || user?.avatarUrl

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Редактировать профиль
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-1">
          {/* Avatar */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group"
            >
              <Avatar className="h-20 w-20 ring-2 ring-border">
                <AvatarImage src={avatarSrc ?? undefined} alt="Аватар" />
                <AvatarFallback className="text-lg font-medium bg-muted text-foreground">
                  {(user?.username || "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-foreground" />
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-username" className="text-foreground">Имя пользователя</Label>
            <Input
              id="edit-username"
              {...register("username")}
              className="bg-secondary border-border"
            />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-bio" className="text-foreground">О себе</Label>
            <textarea
              id="edit-bio"
              rows={3}
              placeholder="Расскажите о себе..."
              {...register("bio")}
              className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-colors"
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              "Сохранить"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
