"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  createPostSchema,
  type CreatePostFormValues,
  validationConstants,
} from "../lib/validation"
import { useCreatePost } from "../hooks/useCreatePost"
import { ImageUpload, type ImageUploadFile } from "./ImageUpload"
import { LocationPicker } from "./LocationPicker"
import { HashtagInput } from "./HashtagInput"
import { MentionInput } from "./MentionInput"
import type { Place } from "@/shared/types/models"

const { MAX_CAPTION_LENGTH } = validationConstants

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostCreated?: () => void
}

export function CreatePostDialog({
  open,
  onOpenChange,
  onPostCreated,
}: CreatePostDialogProps) {
  const t = useTranslations("createPost")
  const [imageFiles, setImageFiles] = useState<ImageUploadFile[]>([])
  const [place, setPlace] = useState<Place | null>(null)
  const [placeDisplayName, setPlaceDisplayName] = useState("")

  const createPost = useCreatePost()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { privacy: "public" },
  })

  const caption = watch("caption") ?? ""

  const resetAll = useCallback(() => {
    reset({ caption: "", location: "", hashtags: "", privacy: "public" })
    setImageFiles([])
    setPlace(null)
    setPlaceDisplayName("")
  }, [reset])

  const onSubmit = useCallback(
    async (data: CreatePostFormValues) => {
      const hasText = (data.caption ?? "").trim().length > 0
      if (imageFiles.length === 0 && !hasText) {
        toast.error(t("validation.mediaOrText"))
        return
      }

      const formData = new FormData()
      if (data.caption) formData.append("caption", data.caption.trim())
      if (data.hashtags) {
        const tags = data.hashtags
          .split(/[,\s]+/)
          .map((t) => t.replace(/^#/, "").trim())
          .filter(Boolean)
        if (tags.length) formData.append("hashtags", JSON.stringify(tags))
      }
      if (place) {
        formData.append("location", placeDisplayName || place.name)
        formData.append("lat", String(place.lat))
        formData.append("lng", String(place.lng))
      } else if (data.location) {
        formData.append("location", data.location)
      }
      formData.append("privacy", data.privacy)
      imageFiles.forEach((item) => formData.append("image", item.file))

      try {
        await createPost.mutateAsync(formData)
        toast.success(t("success"))
        resetAll()
        onOpenChange(false)
        onPostCreated?.()
      } catch {
        toast.error(t("error"))
      }
    },
    [
      imageFiles,
      place,
      placeDisplayName,
      createPost,
      resetAll,
      onOpenChange,
      onPostCreated,
      t,
    ]
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetAll()
        onOpenChange(v)
      }}
    >
      <DialogContent className="sm:max-w-lg border-border bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pt-1"
        >
          <div>
            <Label className="text-foreground">{t("media")}</Label>
            <ImageUpload
              files={imageFiles}
              onChange={setImageFiles}
              error={errors.caption?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="post-caption" className="text-foreground">
              {t("caption")}
            </Label>
            <MentionInput
              value={caption}
              onChange={(v) => setValue("caption", v, { shouldValidate: true })}
              placeholder={t("captionPlaceholder")}
            />
            {caption.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {caption.length} / {MAX_CAPTION_LENGTH}
              </p>
            )}
            {errors.caption && (
              <p className="text-xs text-destructive">
                {errors.caption.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1.5 block text-foreground">{t("location")}</Label>
            <LocationPicker
              value={place}
              displayName={placeDisplayName}
              onSelect={(p, name) => {
                setPlace(p)
                setPlaceDisplayName(name)
                setValue("location", name)
              }}
              onQueryChange={(q) => setValue("location", q)}
            />
          </div>

          <HashtagInput
            value={watch("hashtags") ?? ""}
            onChange={(v) => setValue("hashtags", v)}
          />

          <div>
            <Label className="mb-2 block text-foreground">{t("privacy")}</Label>
            <RadioGroup
              value={watch("privacy")}
              onValueChange={(v) =>
                setValue("privacy", v as "public" | "followers")
              }
              className="flex gap-4"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="public" />
                <span className="text-sm">{t("public")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="followers" />
                <span className="text-sm">{t("followers")}</span>
              </label>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            disabled={createPost.isPending}
            className="w-full mt-1"
          >
            {createPost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("posting")}
              </>
            ) : (
              t("post")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
