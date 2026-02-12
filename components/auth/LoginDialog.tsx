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

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
})

type LoginForm = z.infer<typeof loginSchema>

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToRegister: () => void
}

export function LoginDialog({
  open,
  onOpenChange,
  onSwitchToRegister,
}: LoginDialogProps) {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setIsSubmitting(true)
    try {
      await login(data.email, data.password)
      toast.success("Вы успешно вошли!")
      reset()
      onOpenChange(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Ошибка входа. Попробуйте ещё раз."
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
            Войти в RouteWise
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Зарегистрироваться
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
