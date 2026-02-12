"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Compass } from "lucide-react"

import { RegisterForm } from "@/features/auth"

function RegisterPageContent() {
  const t = useTranslations("auth")
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

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
          <h1 className="text-2xl font-bold text-foreground">{t("registerTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("registerSubtitle")}</p>
        </div>
        <RegisterForm redirectTo={redirect} />
        <p className="text-center text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link
            href={redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
            className="font-semibold text-primary hover:text-primary/80"
          >
            {t("login")}
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
      <RegisterPageContent />
    </Suspense>
  )
}
