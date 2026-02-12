"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useResetPassword } from "@/features/auth/hooks"

const schema = z
  .object({
    newPassword: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })
type FormValues = z.infer<typeof schema>

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations("auth")
  const mutation = useResetPassword(token)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    try {
      await mutation.mutateAsync(data.newPassword)
      toast.success(t("resetSuccess"))
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Error")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-new">{t("newPassword")}</Label>
        <Input
          id="reset-new"
          type="password"
          placeholder="••••••••"
          {...register("newPassword")}
          className="bg-secondary border-border"
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reset-confirm">{t("confirmPassword")}</Label>
        <Input
          id="reset-confirm"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          className="bg-secondary border-border"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ...
          </>
        ) : (
          t("savePassword")
        )}
      </Button>
    </form>
  )
}
