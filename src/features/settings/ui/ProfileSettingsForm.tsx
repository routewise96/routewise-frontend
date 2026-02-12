"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/features/auth"
import { useUpdateProfile } from "@/features/profile/hooks"

const profileSchema = z.object({
  username: z.string().min(2, "Min 2"),
  bio: z.string().max(200).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  social: z.string().max(100).optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSettingsForm() {
  const t = useTranslations("settings")
  const { user } = useAuth()
  const updateProfile = useUpdateProfile()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username ?? "",
      bio: user?.bio ?? "",
      website: "",
      social: "",
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        username: user.username ?? "",
        bio: user.bio ?? "",
        website: "",
        social: "",
      })
    }
  }, [user, reset])

  const onSubmit = (data: ProfileFormValues) => {
    const formData = new FormData()
    formData.append("username", data.username)
    if (data.bio) formData.append("bio", data.bio)
    if (data.website) formData.append("website", data.website)
    if (data.social) formData.append("social", data.social)
    if (file) formData.append("avatar", file)
    updateProfile.mutate(formData, {
      onSuccess: () => {
        toast.success(t("saved"))
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Error")
      },
    })
  }

  const avatarSrc = preview ?? user?.avatarUrl ?? (user as { avatar_url?: string })?.avatar_url

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarSrc} alt="" />
          <AvatarFallback>{(user?.username ?? "?").slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) { setFile(f); setPreview(URL.createObjectURL(f)) }
          }} />
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Camera className="mr-2 h-4 w-4" />
            {t("profileTab.avatar")}
          </Button>
        </div>
      </div>
      <div>
        <Label>{t("profileTab.name")}</Label>
        <Input {...register("username")} className="mt-1" />
        {errors.username && <p className="text-xs text-destructive mt-1">{errors.username.message}</p>}
      </div>
      <div>
        <Label>{t("profileTab.bio")}</Label>
        <Textarea {...register("bio")} rows={3} className="mt-1" />
        {errors.bio && <p className="text-xs text-destructive mt-1">{errors.bio.message}</p>}
      </div>
      <div>
        <Label>{t("profileTab.website")}</Label>
        <Input {...register("website")} placeholder="https://" className="mt-1" />
        {errors.website && <p className="text-xs text-destructive mt-1">{errors.website.message}</p>}
      </div>
      <div>
        <Label>{t("profileTab.social")}</Label>
        <Input {...register("social")} placeholder="" className="mt-1" />
      </div>
      <Button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("save")}
      </Button>
    </form>
  )
}
