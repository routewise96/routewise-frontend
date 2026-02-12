"use client"

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
} from "lucide-react"
import Image from "next/image"

export interface Post {
  id: number
  username: string
  avatarUrl: string
  location: string
  timestamp: string
  imageUrl: string
  caption: string
  hashtags: string[]
  likes: number
  comments: number
  liked: boolean
  saved: boolean
}

interface PostCardProps {
  post: Post
  onToggleLike: (id: number) => void
  onToggleSave: (id: number) => void
}

export function PostCard({ post, onToggleLike, onToggleSave }: PostCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card overflow-hidden transition-colors hover:border-border/80">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Image
            src={post.avatarUrl || "https://i.pravatar.cc/150?img=1"}
            alt={`${post.username}`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {post.username}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{post.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{post.timestamp}</span>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Ещё"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={post.imageUrl || `https://picsum.photos/600/400?random=${post.id}`}
          alt={post.caption || "Фото из путешествия"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {/* Actions */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleLike(post.id)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-90 ${
                post.liked
                  ? "text-destructive"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              aria-label={post.liked ? "Убрать лайк" : "Лайк"}
            >
              <Heart
                className={`h-5 w-5 transition-all ${
                  post.liked ? "fill-current scale-110" : ""
                }`}
              />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Комментировать"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Поделиться"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => onToggleSave(post.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-90 ${
              post.saved
                ? "text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
            aria-label={post.saved ? "Убрать из сохранённых" : "Сохранить"}
          >
            <Bookmark
              className={`h-5 w-5 ${post.saved ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 py-2 text-sm">
          <span className="font-semibold text-foreground">
            {post.likes.toLocaleString()}{" "}
            <span className="font-normal text-muted-foreground">
              {"лайков"}
            </span>
          </span>
          <span className="font-semibold text-foreground">
            {post.comments}{" "}
            <span className="font-normal text-muted-foreground">
              {"ответов"}
            </span>
          </span>
        </div>

        {/* Caption */}
        <div className="pb-4">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">{post.username}</span>{" "}
            {post.caption}
          </p>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {post.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm font-medium text-primary hover:text-primary/80 cursor-pointer transition-colors"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
