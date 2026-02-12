const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (username: string, email: string, password: string) =>
      fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
  },
  posts: {
    feed: (page = 1) => fetchAPI(`/posts?page=${page}`),
    like: (postId: number) => fetchAPI(`/posts/${postId}/like`, { method: 'POST' }),
    unlike: (postId: number) => fetchAPI(`/posts/${postId}/like`, { method: 'DELETE' }),
    save: (postId: number) => fetchAPI(`/posts/${postId}/save`, { method: 'POST' }),
    unsave: (postId: number) => fetchAPI(`/posts/${postId}/save`, { method: 'DELETE' }),
  },
  recommendations: {
    destinations: () => fetchAPI('/recommendations/destinations'),
    hashtags: () => fetchAPI('/recommendations/trending'),
  },
  notifications: {
    unread: () => fetchAPI('/notifications/unread'),
  },
};
