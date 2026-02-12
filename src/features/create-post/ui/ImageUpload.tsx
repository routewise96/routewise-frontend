"use client"

import { useCallback } from "react"
import { ImagePlus, X } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import {
  validateFile,
  validationConstants,
} from "../lib/validation"

const { MAX_IMAGES, MAX_IMAGE_SIZE_MB, IMAGE_TYPES } = validationConstants

export interface ImageUploadFile {
  file: File
  preview: string
}

interface ImageUploadProps {
  files: ImageUploadFile[]
  onChange: (files: ImageUploadFile[]) => void
  error?: string
}

export function ImageUpload({ files, onChange, error }: ImageUploadProps) {
  const t = useTranslations("createPost")

  const addFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles?.length) return
      const remaining = MAX_IMAGES - files.length
      if (remaining <= 0) return
      const toAdd: ImageUploadFile[] = []
      for (let i = 0; i < Math.min(newFiles.length, remaining); i++) {
        const file = newFiles[i]
        const result = validateFile(file, "image")
        if (!result.ok) continue
        toAdd.push({
          file,
          preview: URL.createObjectURL(file),
        })
      }
      if (toAdd.length) onChange([...files, ...toAdd])
    },
    [files, onChange]
  )

  const remove = useCallback(
    (index: number) => {
      const next = files.filter((_, i) => i !== index)
      URL.revokeObjectURL(files[index].preview)
      onChange(next)
    },
    [files, onChange]
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {files.map((item, index) => (
          <div
            key={index}
            className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-muted"
          >
            <Image
              src={item.preview}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
              aria-label={t("removeImage")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {files.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => document.getElementById("image-upload-input")?.click()}
            className="flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs">{t("addImage")}</span>
          </button>
        )}
      </div>
      <input
        id="image-upload-input"
        type="file"
        accept={IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ""
        }}
      />
      <p className="text-xs text-muted-foreground">
        {t("imageHint")}
      </p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
