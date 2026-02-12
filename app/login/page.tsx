"use client"

import { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Compass } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useAuth } from "@/components/auth/AuthProvider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setIsSubmitting(true)
    try {
      await login(data.email, data.password)
      toast.success("Вы успешно вошли!")
      router.replace(redirect)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Ошибка входа. Попробуйте ещё раз."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-foreground hover:opacity-80"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Compass className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold">RouteWise</span>
      </Link>

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Вход в аккаунт</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Введите email и пароль
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-foreground">
              Email
            </Label>
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
            <Label htmlFor="login-password" className="text-foreground">
              Пароль
            </Label>
            <Input
              id="login-password"
              type="password"
              placeholder="Минимум 6 символов"
              {...register("password")}
              className="bg-secondary border-border"
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <Link
            href={`/register${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-semibold text-primary hover:text-primary/80"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
