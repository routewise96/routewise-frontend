"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useChangePassword } from "../hooks"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(8, "Min 8"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Must match", path: ["confirmPassword"] })

type PasswordFormValues = z.infer<typeof passwordSchema>

export function SecuritySettingsForm() {
  const t = useTranslations("settings")
  const changePassword = useChangePassword()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = (data: PasswordFormValues) => {
    changePassword.mutate(
      { oldPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success(t("securityTab.passwordChanged"))
          reset()
        },
        onError: () => {
          toast.error(t("securityTab.passwordError"))
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label>{t("securityTab.currentPassword")}</Label>
        <Input type="password" {...register("currentPassword")} className="mt-1" autoComplete="current-password" />
        {errors.currentPassword && <p className="text-xs text-destructive mt-1">{errors.currentPassword.message}</p>}
      </div>
      <div>
        <Label>{t("securityTab.newPassword")}</Label>
        <Input type="password" {...register("newPassword")} className="mt-1" autoComplete="new-password" />
        {errors.newPassword && <p className="text-xs text-destructive mt-1">{errors.newPassword.message}</p>}
      </div>
      <div>
        <Label>{t("securityTab.confirmPassword")}</Label>
        <Input type="password" {...register("confirmPassword")} className="mt-1" autoComplete="new-password" />
        {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" disabled={changePassword.isPending}>
        {changePassword.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("securityTab.changePassword")}
      </Button>
      <div className="mt-6">
        <h3 className="text-lg font-medium">{t("securityTab.2faTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("securityTab.2faPlaceholder")}</p>
      </div>
    </form>
  )
}
