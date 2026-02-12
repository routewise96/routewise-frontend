"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Compass } from "lucide-react"

import { ForgotPasswordForm } from "@/features/auth"

export default function ForgotPasswordPage() {
  const t = useTranslations("auth")

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
          <h1 className="text-2xl font-bold text-foreground">{t("forgotTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("forgotSubtitle")}</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
