const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://routewise.ru/api";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    let errorMsg: string;
    try {
      const errJson = await res.json();
      errorMsg =
        errJson.message || errJson.error || errJson.detail || res.statusText;
    } catch {
      errorMsg = await res.text().catch(() => res.statusText);
    }
    throw new Error(errorMsg);
  }

  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  // --- Auth ---
  auth: {
    login: (email: string, password: string) =>
      fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

	register: (username: string, email: string, password: string) =>
  fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  }),

    changePassword: (oldPassword: string, newPassword: string) =>
      fetchAPI("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword, newPassword }),
      }),
  },

  // --- Posts ---
  posts: {
    feed: (page = 1) => fetchAPI(`/posts?page=${page}`),
    byAuthor: (authorId: number, page = 1) =>
      fetchAPI(`/posts?authorId=${authorId}&page=${page}`),
    byId: (id: number) => fetchAPI(`/posts/${id}`),
    create: (formData: FormData) =>
      fetchAPI("/posts", { method: "POST", body: formData }),
    like: (postId: number) =>
      fetchAPI(`/posts/${postId}/like`, { method: "POST" }),
    unlike: (postId: number) =>
      fetchAPI(`/posts/${postId}/like`, { method: "DELETE" }),
    save: (postId: number) =>
      fetchAPI(`/posts/${postId}/save`, { method: "POST" }),
    unsave: (postId: number) =>
      fetchAPI(`/posts/${postId}/save`, { method: "DELETE" }),
  },

  // --- Users ---
  users: {
    me: () => fetchAPI("/users/me"),
    getMe: () => fetchAPI("/users/me"),
    byId: (id: number) => fetchAPI(`/users/${id}`),
    updateMe: (formData: FormData) =>
      fetchAPI("/users/me", { method: "PUT", body: formData }),
    saved: (page = 1) => fetchAPI(`/users/me/saved?page=${page}`),
    followers: (id: number) => fetchAPI(`/users/${id}/followers`),
    following: (id: number) => fetchAPI(`/users/${id}/following`),
    follow: (id: number) =>
      fetchAPI(`/users/${id}/follow`, { method: "POST" }),
    unfollow: (id: number) =>
      fetchAPI(`/users/${id}/follow`, { method: "DELETE" }),
  },

  // --- Recommendations ---
  recommendations: {
    destinations: () => fetchAPI("/recommendations/destinations"),
    hashtags: () => fetchAPI("/recommendations/trending"),
  },

  // --- Notifications ---
  notifications: {
    unread: () => fetchAPI("/notifications/unread"),
    all: (page = 1, limit?: number) =>
      fetchAPI(
        limit
          ? `/notifications?page=${page}&limit=${limit}`
          : `/notifications?page=${page}`
      ),
    markRead: (id: number) =>
      fetchAPI(`/notifications/${id}/read`, { method: "POST" }),
    markAllRead: () =>
      fetchAPI("/notifications/read-all", { method: "POST" }),
  },

  // --- Search ---
  search: {
    query: (q: string) => fetchAPI(`/search?q=${encodeURIComponent(q)}`),
  },

  // --- Bookings ---
  bookings: {
    list: (page = 1) => fetchAPI(`/bookings?page=${page}`),
  },
};
