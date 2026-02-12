"use client"

import { useTranslations } from "next-intl"
import { Compass } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RegisterForm } from "./RegisterForm"

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
  const t = useTranslations("auth")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader className="items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
            <Compass className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {t("registerTitle")}
          </DialogTitle>
        </DialogHeader>
        <RegisterForm redirectTo={undefined} onSuccess={() => onOpenChange(false)} showOAuth={false} />
        <p className="text-center text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t("login")}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
