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

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Минимум 3 символа")
      .max(30, "Максимум 30 символов")
      .regex(/^[a-zA-Z0-9_]+$/, "Только латинские буквы, цифры и _"),
    email: z.string().email("Введите корректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

type RegisterForm = z.infer<typeof registerSchema>

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const { register: authRegister } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterForm) {
    setIsSubmitting(true)
    try {
      await authRegister(data.username, data.email, data.password)
      toast.success("Регистрация прошла успешно!")
      router.replace(redirect)
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Ошибка регистрации. Попробуйте ещё раз."
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
          <h1 className="text-2xl font-bold text-foreground">
            Создать аккаунт
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Заполните форму для регистрации
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-username" className="text-foreground">
              Имя пользователя
            </Label>
            <Input
              id="reg-username"
              placeholder="travel_lover"
              {...register("username")}
              className="bg-secondary border-border"
            />
            {errors.username && (
              <p className="text-xs text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email" className="text-foreground">
              Email
            </Label>
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
            <Label htmlFor="reg-password" className="text-foreground">
              Пароль
            </Label>
            <Input
              id="reg-password"
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

          <div className="space-y-2">
            <Label htmlFor="reg-confirm" className="text-foreground">
              Подтвердите пароль
            </Label>
            <Input
              id="reg-confirm"
              type="password"
              placeholder="Повторите пароль"
              {...register("confirmPassword")}
              className="bg-secondary border-border"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Регистрация...
              </>
            ) : (
              "Зарегистрироваться"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link
            href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-semibold text-primary hover:text-primary/80"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
