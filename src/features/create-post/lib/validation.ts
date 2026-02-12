import { z } from "zod"

const MAX_IMAGES = 10
const MAX_IMAGE_SIZE_MB = 10
const MAX_VIDEO_SIZE_MB = 100
const MAX_CAPTION_LENGTH = 2000
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const VIDEO_TYPES = ["video/mp4", "video/webm"]

export const createPostSchema = z.object({
  caption: z.string().max(MAX_CAPTION_LENGTH).optional(),
  location: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  hashtags: z.string().optional(),
  privacy: z.enum(["public", "followers"]).default("public"),
})

export type CreatePostFormValues = z.infer<typeof createPostSchema>

export function validateFile(
  file: File,
  type: "image" | "video"
): { ok: true } | { ok: false; error: string } {
  const isImage = type === "image"
  const maxMb = isImage ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB
  const allowed = isImage ? IMAGE_TYPES : VIDEO_TYPES
  if (!allowed.includes(file.type)) {
    return { ok: false, error: "validation.wrongType" }
  }
  if (file.size > maxMb * 1024 * 1024) {
    return { ok: false, error: "validation.fileTooBig" }
  }
  return { ok: true }
}

export const validationConstants = {
  MAX_IMAGES,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
  MAX_CAPTION_LENGTH,
  IMAGE_TYPES,
  VIDEO_TYPES,
}
