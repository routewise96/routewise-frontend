"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useForgotPassword } from "@/features/auth/hooks"

const schema = z.object({ email: z.string().email("Invalid email") })
type FormValues = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const t = useTranslations("auth")
  const mutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    try {
      await mutation.mutateAsync(data.email)
      toast.success(t("forgotSuccess"))
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Error")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="forgot-email">{t("email")}</Label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="bg-secondary border-border"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ...
          </>
        ) : (
          t("sendLink")
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          {t("login")}
        </Link>
      </p>
    </form>
  )
}
