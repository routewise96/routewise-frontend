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
import { useLogin } from "@/features/auth/hooks"
import { OAuthButtons } from "./OAuthButtons"

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  redirectTo?: string
  onSuccess?: () => void
  showOAuth?: boolean
}

export function LoginForm({ redirectTo = "/", onSuccess, showOAuth = true }: LoginFormProps) {
  const t = useTranslations("auth")
  const loginMutation = useLogin(redirectTo)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    try {
      await loginMutation.mutateAsync(data)
      toast.success(t("loginSuccess"))
      onSuccess?.()
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? t("loginError"))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {showOAuth && (
        <>
          <OAuthButtons />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("orDivider")}</span>
            </div>
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="login-email">{t("email")}</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="bg-secondary border-border"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">{t("password")}</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••"
          {...register("password")}
          className="bg-secondary border-border"
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
            {t("forgotPassword")}
          </Link>
        </div>
      </div>
      <Button type="submit" disabled={loginMutation.isPending} className="w-full">
        {loginMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("login")}...
          </>
        ) : (
          t("login")
        )}
      </Button>
    </form>
  )
}
