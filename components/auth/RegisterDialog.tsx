"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Compass } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "./AuthProvider"

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

interface RegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin: () => void
}

export function RegisterDialog({
  open,
  onOpenChange,
  onSwitchToLogin,
}: RegisterDialogProps) {
  const { register: authRegister } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterForm) {
    setIsSubmitting(true)
    try {
      await authRegister(data.username, data.email, data.password)
      toast.success("Регистрация прошла успешно!")
      reset()
      onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader className="items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
            <Compass className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Создать аккаунт
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
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
              <p className="text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
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

          <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Регистрация...
              </>
            ) : (
              "Зарегистрироваться"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Войти
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
