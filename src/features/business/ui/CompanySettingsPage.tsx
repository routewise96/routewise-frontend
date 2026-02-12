"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Loader2, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCompanyProfile, useUpdateCompanyProfile } from "../hooks"
import { BusinessLayout } from "./BusinessLayout"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function CompanySettingsPage() {
  const t = useTranslations("business")
  const fileRef = useRef<HTMLInputElement>(null)
  const { data: company, isLoading, error } = useCompanyProfile()
  const updateProfile = useUpdateCompanyProfile()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [categoriesStr, setCategoriesStr] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (company) {
      setName(company.name)
      setDescription(company.description ?? "")
      setAddress(company.address ?? "")
      setPhone(company.phone ?? "")
      setEmail(company.email ?? "")
      setWebsite(company.website ?? "")
      setCategoriesStr(company.categories?.join(", ") ?? "")
    }
  }, [company])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setLogoFile(f)
      setLogoPreview(URL.createObjectURL(f))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData()
    form.append("name", name)
    if (description) form.append("description", description)
    if (address) form.append("address", address)
    if (phone) form.append("phone", phone)
    if (email) form.append("email", email)
    if (website) form.append("website", website)
    const cats = categoriesStr.split(",").map((s) => s.trim()).filter(Boolean)
    if (cats.length) form.append("categories", JSON.stringify(cats))
    if (logoFile) form.append("logo", logoFile)
    updateProfile.mutate(form, {
      onSuccess: () => toast.success(t("profileUpdated")),
      onError: () => toast.error(t("error")),
    })
  }

  if (isLoading) {
    return (
      <BusinessLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </BusinessLayout>
    )
  }

  if (error || !company) {
    return (
      <BusinessLayout>
        <p className="text-muted-foreground">{t("error")}</p>
      </BusinessLayout>
    )
  }

  const logoSrc = logoPreview ?? company.logo

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("settings")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("companyProfile")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={logoSrc} alt="" />
                  <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" />
                    {t("uploadLogo")}
                  </Button>
                </div>
              </div>
              <div>
                <Label>{t("companyName")}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label>{t("companyDescription")}</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={3} />
              </div>
              <div>
                <Label>{t("address")}</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>{t("phone")}</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>{t("email")}</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>{t("website")}</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1" placeholder="https://" />
              </div>
              <div>
                <Label>{t("categories")}</Label>
                <Input value={categoriesStr} onChange={(e) => setCategoriesStr(e.target.value)} className="mt-1" placeholder="hotel, restaurant" />
              </div>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "..." : t("save")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  )
}
