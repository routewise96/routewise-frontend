"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Settings, Lock, User, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { AppShell } from "@/components/AppShell"
import { useAuth } from "@/components/auth/AuthProvider"
import { EditProfileDialog } from "@/components/EditProfileDialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Введите текущий пароль"),
    newPassword: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

type PasswordForm = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { user } = useAuth()
  const [editOpen, setEditOpen] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  async function onPasswordSubmit(data: PasswordForm) {
    setIsChangingPassword(true)
    try {
      await api.auth.changePassword(data.oldPassword, data.newPassword)
      toast.success("Пароль успешно изменён!")
      reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка смены пароля")
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (!user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Войдите в аккаунт
          </h2>
          <p className="text-muted-foreground">
            Чтобы изменить настройки, необходимо авторизоваться.
          </p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center gap-2 pb-6">
          <Settings className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Настройки</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1 gap-1.5">
              <User className="h-4 w-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 gap-1.5">
              <Lock className="h-4 w-4" />
              Безопасность
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="rounded-2xl border border-border bg-card p-6 mt-4">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Информация профиля
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Имя пользователя</span>
                  <span className="text-sm font-medium text-foreground">{user.username}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium text-foreground">{user.email}</span>
                </div>
                {user.bio && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">О себе</span>
                    <span className="text-sm font-medium text-foreground max-w-xs text-right">
                      {user.bio}
                    </span>
                  </div>
                )}
              </div>
              <Button
                className="mt-4 w-full"
                variant="outline"
                onClick={() => setEditOpen(true)}
              >
                Редактировать профиль
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="rounded-2xl border border-border bg-card p-6 mt-4">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Смена пароля
              </h2>
              <form
                onSubmit={handleSubmit(onPasswordSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="old-password" className="text-foreground">
                    Текущий пароль
                  </Label>
                  <Input
                    id="old-password"
                    type="password"
                    {...register("oldPassword")}
                    className="bg-secondary border-border"
                    placeholder="Введите текущий пароль"
                  />
                  {errors.oldPassword && (
                    <p className="text-xs text-destructive">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="new-password" className="text-foreground">
                    Новый пароль
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    {...register("newPassword")}
                    className="bg-secondary border-border"
                    placeholder="Минимум 6 символов"
                  />
                  {errors.newPassword && (
                    <p className="text-xs text-destructive">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm-password" className="text-foreground">
                    Подтвердите пароль
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    {...register("confirmPassword")}
                    className="bg-secondary border-border"
                    placeholder="Повторите новый пароль"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Изменить пароль"
                  )}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </AppShell>
  )
}
