"use client"

import { useTranslations } from "next-intl"
import { Compass } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "./LoginForm"

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
  const t = useTranslations("auth")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader className="items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
            <Compass className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {t("loginTitle")}
          </DialogTitle>
        </DialogHeader>
        <LoginForm redirectTo={undefined} onSuccess={() => onOpenChange(false)} showOAuth={false} />
        <p className="text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t("register")}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
