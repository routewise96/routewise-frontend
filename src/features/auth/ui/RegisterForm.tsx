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
import { useRegister } from "@/features/auth/hooks"
import { OAuthButtons } from "./OAuthButtons"

const registerSchema = z
  .object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] })

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  redirectTo?: string
  onSuccess?: () => void
  showOAuth?: boolean
}

export function RegisterForm({ redirectTo = "/", onSuccess, showOAuth = true }: RegisterFormProps) {
  const t = useTranslations("auth")
  const registerMutation = useRegister(redirectTo)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormValues) {
    try {
      await registerMutation.mutateAsync(data)
      toast.success(t("registerSuccess"))
      onSuccess?.()
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? t("registerError"))
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
        <Label htmlFor="reg-username">{t("username")}</Label>
        <Input
          id="reg-username"
          placeholder="travel_lover"
          {...register("username")}
          className="bg-secondary border-border"
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">{t("email")}</Label>
        <Input
          id="reg-email"
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
        <Label htmlFor="reg-password">{t("password")}</Label>
        <Input
          id="reg-password"
          type="password"
          placeholder="••••••"
          {...register("password")}
          className="bg-secondary border-border"
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-confirm">{t("confirmPassword")}</Label>
        <Input
          id="reg-confirm"
          type="password"
          placeholder="••••••"
          {...register("confirmPassword")}
          className="bg-secondary border-border"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" disabled={registerMutation.isPending} className="w-full">
        {registerMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("register")}...
          </>
        ) : (
          t("register")
        )}
      </Button>
    </form>
  )
}
