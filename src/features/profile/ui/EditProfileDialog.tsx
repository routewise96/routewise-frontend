"use client"

import { useState, useRef, useEffect, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
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
import { useAuth } from "@/features/auth"
import { useUpdateProfile } from "@/features/profile/hooks"

const profileSchema = z.object({
  username: z.string().min(2, "Min 2 chars"),
  bio: z.string().max(200, "Max 200").optional(),
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
  const t = useTranslations("profile")
  const { user } = useAuth()
  const updateProfile = useUpdateProfile()
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
    defaultValues: { username: user?.username ?? "", bio: user?.bio ?? "" },
  })

  useEffect(() => {
    if (open && user) {
      reset({ username: user.username, bio: user.bio ?? "" })
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
    const formData = new FormData()
    formData.append("username", data.username)
    if (data.bio) formData.append("bio", data.bio)
    if (file) formData.append("avatar", file)
    try {
      await updateProfile.mutateAsync(formData)
      toast.success(t("profileUpdated"))
      onOpenChange(false)
      onProfileUpdated?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error")
    }
  }

  const avatarSrc = preview ?? user?.avatarUrl

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {t("editProfile")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-1">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group"
            >
              <Avatar className="h-20 w-20 ring-2 ring-border">
                <AvatarImage src={avatarSrc} alt="Avatar" />
                <AvatarFallback className="text-lg font-medium bg-muted text-foreground">
                  {(user?.username ?? "?").slice(0, 2).toUpperCase()}
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
          <div className="space-y-2">
            <Label htmlFor="edit-username">Username</Label>
            <Input
              id="edit-username"
              {...register("username")}
              className="bg-secondary border-border"
            />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-bio">Bio</Label>
            <textarea
              id="edit-bio"
              rows={3}
              placeholder="Bio..."
              {...register("bio")}
              className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm resize-none"
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>
          <Button type="submit" disabled={updateProfile.isPending} className="w-full">
            {updateProfile.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("edit")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
