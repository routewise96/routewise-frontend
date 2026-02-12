"use client"

import { useState } from "react"
import {
  Compass,
  Search,
  Bell,
  Mail,
  Home,
  Map,
  CalendarDays,
  User,
  Settings,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  ChevronDown,
  Loader2,
  TrendingUp,
  Plane,
} from "lucide-react"
import Image from "next/image"

// --- Types ---

interface Post {
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

interface Destination {
  id: number
  name: string
  country: string
  imageUrl: string
  rating: number
}

// --- Mock Data ---

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    username: "alex_travel",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    location: "Bali, Indonesia",
    timestamp: "2 hours ago",
    imageUrl: `https://picsum.photos/600/400?random=1`,
    caption: "Sunrise at Mount Batur volcano - incredible!",
    hashtags: ["#bali", "#volcano", "#sunrise"],
    likes: 124,
    comments: 18,
    liked: false,
    saved: false,
  },
  {
    id: 2,
    username: "maria_wanders",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    location: "Swiss Alps",
    timestamp: "5 hours ago",
    imageUrl: `https://picsum.photos/600/400?random=1`,
    caption: "These mountains never get old. Fresh air, stunning views, and complete silence.",
    hashtags: ["#alps", "#mountains", "#switzerland"],
    likes: 287,
    comments: 42,
    liked: false,
    saved: false,
  },
  {
    id: 3,
    username: "tokyo_nomad",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    location: "Shibuya, Tokyo",
    timestamp: "8 hours ago",
    imageUrl: `https://picsum.photos/600/400?random=1`,
    caption: "Night walks through Shibuya. The neon glow of Tokyo is something else entirely.",
    hashtags: ["#tokyo", "#japan", "#nightlife"],
    likes: 456,
    comments: 67,
    liked: false,
    saved: false,
  },
]

const EXTRA_POSTS: Post[] = [
  {
    id: 100,
    username: "elena_adventures",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    location: "Santorini, Greece",
    timestamp: "12 hours ago",
    imageUrl: `https://picsum.photos/600/400?random=1`,
    caption: "Blue domes and sunsets. Santorini is a dream come true.",
    hashtags: ["#santorini", "#greece", "#sunset"],
    likes: 312,
    comments: 29,
    liked: false,
    saved: false,
  },
  {
    id: 101,
    username: "mark_explores",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    location: "Marrakech, Morocco",
    timestamp: "1 day ago",
    imageUrl: `https://picsum.photos/600/400?random=1`,
    caption: "Lost in the colors of Marrakech. Every corner is a new discovery.",
    hashtags: ["#morocco", "#marrakech", "#travel"],
    likes: 198,
    comments: 23,
    liked: false,
    saved: false,
  },
]

const DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: "Iceland",
    country: "Northern Lights Tour",
    imageUrl: `https://picsum.photos/600/400?random=1`,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Santorini",
    country: "Greek Islands",
    imageUrl: `https://picsum.photos/600/400?random=1`,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Morocco",
    country: "Marrakech & Beyond",
    imageUrl: `https://picsum.photos/600/400?random=1`,
    rating: 4.7,
  },
]

// --- Sidebar Nav Items ---

const NAV_ITEMS = [
  { icon: Home, label: "Home", active: true },
  { icon: Map, label: "Map", active: false },
  { icon: CalendarDays, label: "Bookings", active: false },
  { icon: User, label: "Profile", active: false },
  { icon: Settings, label: "Settings", active: false },
]

const BOTTOM_NAV_ITEMS = [
  { icon: Home, label: "Home", active: true },
  { icon: Map, label: "Map", active: false },
  { icon: CalendarDays, label: "Bookings", active: false },
  { icon: User, label: "Profile", active: false },
  { icon: Bell, label: "Alerts", active: false },
]

// --- Components ---

function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">RouteWise</span>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search destinations, travelers..."
              className="w-full rounded-xl border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Messages"
          >
            <Mail className="h-5 w-5" />
          </button>
          <button className="ml-1 h-9 w-9 overflow-hidden rounded-full ring-2 ring-border transition-all hover:ring-primary" aria-label="User profile">
            <Image
              src="https://i.pravatar.cc/150?img=1"
              alt="Your avatar"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search destinations, travelers..."
              className="w-full rounded-xl border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-60 xl:w-64 flex-col fixed left-0 top-[57px] bottom-0 border-r border-border bg-background px-3 py-6">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Card */}
      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-center gap-3 rounded-xl px-4 py-3">
          <Image
            src="https://i.pravatar.cc/150?img=1"
            alt="Your profile"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">John Doe</p>
            <p className="truncate text-xs text-muted-foreground">@johndoe</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function TravelPostCard({
  post,
  onToggleLike,
  onToggleSave,
}: {
  post: Post
  onToggleLike: (id: number) => void
  onToggleSave: (id: number) => void
}) {
  return (
    <article className="rounded-2xl border border-border bg-card overflow-hidden transition-colors hover:border-border/80">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Image
            src={post.avatarUrl}
            alt={`${post.username}'s avatar`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{post.username}</p>
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
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.caption}
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
              aria-label={post.liked ? "Unlike" : "Like"}
            >
              <Heart
                className={`h-5 w-5 transition-all ${post.liked ? "fill-current scale-110" : ""}`}
              />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Comment"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Share"
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
            aria-label={post.saved ? "Unsave" : "Save"}
          >
            <Bookmark className={`h-5 w-5 ${post.saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 py-2 text-sm">
          <span className="font-semibold text-foreground">
            {post.likes.toLocaleString()} <span className="font-normal text-muted-foreground">likes</span>
          </span>
          <span className="font-semibold text-foreground">
            {post.comments} <span className="font-normal text-muted-foreground">replies</span>
          </span>
        </div>

        {/* Caption */}
        <div className="pb-4">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">{post.username}</span>{" "}
            {post.caption}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-sm font-medium text-primary hover:text-primary/80 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary cursor-pointer">
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          className="object-cover transition-transform group-hover:scale-110"
          sizes="56px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{destination.name}</p>
        <p className="text-xs text-muted-foreground">{destination.country}</p>
      </div>
      <div className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1">
        <TrendingUp className="h-3 w-3 text-primary" />
        <span className="text-xs font-semibold text-primary">{destination.rating}</span>
      </div>
    </div>
  )
}

function RecommendationsPanel() {
  return (
    <aside className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-[73px] flex flex-col gap-6">
        {/* Destinations */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Where to go?</h3>
            </div>
            <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              View all
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {DESTINATIONS.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>

        {/* Trending Tags */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="pb-3 text-sm font-bold text-foreground">Trending</h3>
          <div className="flex flex-wrap gap-2">
            {["#digitalnomad", "#backpacking", "#roadtrip", "#solotravel", "#photography", "#adventure"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="px-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span className="hover:text-foreground cursor-pointer transition-colors">About</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Help</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
          </div>
          <p className="mt-2 text-muted-foreground/60">RouteWise 2026</p>
        </div>
      </div>
    </aside>
  )
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors ${
              item.active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={item.label}
          >
            <item.icon className={`h-5 w-5 ${item.active ? "stroke-[2.5]" : ""}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// --- Main Page ---

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [loadCount, setLoadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  function toggleLike(id: number) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    )
  }

  function toggleSave(id: number) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    )
  }

  function handleLoadMore() {
    setLoading(true)
    // Simulate network delay
    setTimeout(() => {
      const newPosts = EXTRA_POSTS.map((p) => ({
        ...p,
        id: p.id + (loadCount + 1) * 1000,
      }))
      setPosts((prev) => [...prev, ...newPosts])
      setLoadCount((c) => c + 1)
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />

      <div className="lg:pl-60 xl:pl-64">
        <main className="mx-auto flex max-w-6xl gap-6 px-4 py-6 lg:px-6">
          {/* Feed Column */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-5">
              {posts.map((post) => (
                <TravelPostCard
                  key={post.id}
                  post={post}
                  onToggleLike={toggleLike}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center py-8 pb-24 lg:pb-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary hover:border-primary/30 disabled:opacity-60 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Load more
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <RecommendationsPanel />
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
