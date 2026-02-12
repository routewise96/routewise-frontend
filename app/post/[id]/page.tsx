"use client"

import { use, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"
import { PostDetail, PostNotFound, usePost } from "@/features/post-detail"

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: post, isLoading, isError, error } = usePost(id)

  useEffect(() => {
    if (post?.caption) {
      const title = `${post.author?.username ?? "Post"} · RouteWise`
      document.title = title
    }
  }, [post])

  const notFound =
    isError &&
    ((error as { statusCode?: number })?.statusCode === 404 ||
      (error as { response?: { status?: number } })?.response?.status === 404)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />

      <div className="lg:pl-60 xl:pl-64">
        <main className="mx-auto max-w-2xl px-4 py-6 lg:px-6">
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          {notFound && <PostNotFound />}
          {!isLoading && !notFound && post && <PostDetail post={post} />}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
