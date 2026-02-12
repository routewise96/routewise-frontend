import type { Comment } from "@/shared/types/models"

export function extractComments(data: unknown): Comment[] {
  if (Array.isArray(data)) return data as Comment[]
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>
    if (Array.isArray(o.comments)) return o.comments as Comment[]
    if (Array.isArray(o.data)) return o.data as Comment[]
    if (Array.isArray(o.items)) return o.items as Comment[]
  }
  return []
}

export function normalizeComment(raw: Record<string, unknown>): Comment {
  return {
    id: (raw.id as number) ?? 0,
    postId: (raw.postId as number) ?? (raw.post_id as number) ?? 0,
    authorId: (raw.authorId as number) ?? (raw.author_id as number) ?? 0,
    author: raw.author as Comment["author"],
    content: (raw.content as string) ?? "",
    parentId: (raw.parentId as number) ?? (raw.parent_id as number),
    likesCount: (raw.likesCount as number) ?? (raw.likes_count as number) ?? 0,
    isLiked: (raw.isLiked as boolean) ?? (raw.is_liked as boolean) ?? false,
    createdAt: (raw.createdAt as string) ?? (raw.created_at as string) ?? "",
    replies: Array.isArray(raw.replies)
      ? (raw.replies as Record<string, unknown>[]).map(normalizeComment)
      : undefined,
  }
}
