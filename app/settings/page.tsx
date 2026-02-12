"use client"

import { useTranslations } from "next-intl"
import { ProtectedRoute } from "@/features/auth"
import { AppShell } from "@/components/AppShell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ProfileSettingsForm,
  SecuritySettingsForm,
  NotificationSettingsForm,
  LanguageSettingsForm,
} from "@/features/settings/ui"

export default function SettingsPage() {
  const t = useTranslations("settings")

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto max-w-2xl px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
              <TabsTrigger value="security">{t("security")}</TabsTrigger>
              <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
              <TabsTrigger value="language">{t("language")}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileSettingsForm />
            </TabsContent>
            <TabsContent value="security">
              <SecuritySettingsForm />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettingsForm />
            </TabsContent>
            <TabsContent value="language">
              <LanguageSettingsForm />
            </TabsContent>
          </Tabs>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
