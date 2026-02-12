"use client"

import useSWR from "swr"
import {
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { useAuth } from "@/components/auth/AuthProvider"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"

export default function BookingsPage() {
  const { user } = useAuth()

  const { data, isLoading, error } = useSWR(
    user ? "/bookings" : null,
    () => api.bookings.list(),
  )

  const bookings = Array.isArray(data) ? data : data?.data || data?.bookings || []

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center gap-2 pb-6">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Бронирования</h1>
        </div>

        {!user ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Войдите в аккаунт
            </h2>
            <p className="text-sm text-muted-foreground">
              Чтобы просмотреть бронирования, необходимо авторизоваться.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Скоро появится
            </h2>
            <p className="text-sm text-muted-foreground">
              Сервис бронирований находится в разработке. Пожалуйста, загляните позже.
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Нет бронирований
            </h2>
            <p className="text-sm text-muted-foreground">
              У вас пока нет активных бронирований.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking: Record<string, unknown>) => (
              <div
                key={booking.id as number}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border/80"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-semibold text-foreground">
                      {(booking.title as string) || (booking.name as string) || "Бронирование"}
                    </h3>
                    {(booking.location as string) && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{booking.location as string}</span>
                      </div>
                    )}
                    {(booking.date as string || booking.checkIn as string) && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {new Date((booking.date as string) || (booking.checkIn as string)).toLocaleDateString("ru-RU")}
                          {(booking.checkOut as string) &&
                            ` — ${new Date(booking.checkOut as string).toLocaleDateString("ru-RU")}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {(booking.status as string) || "Подтверждено"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
