import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://routewise.ru"
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/map`, lastModified: new Date() },
    { url: `${base}/shorts`, lastModified: new Date() },
    { url: `${base}/assistant`, lastModified: new Date() },
    { url: `${base}/bookings`, lastModified: new Date() },
    { url: `${base}/business`, lastModified: new Date() },
    { url: `${base}/settings`, lastModified: new Date() },
    { url: `${base}/notifications`, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
  ]
}
