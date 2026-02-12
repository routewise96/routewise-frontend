// PWA: use with webpack (npm run build -- --webpack). Turbopack does not support next-pwa yet.
// import withPWA from "@ducanh2912/next-pwa"
import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "routewise.ru" },
      { protocol: "https", hostname: "**.routewise.ru" },
    ],
  },
}

export default withBundleAnalyzer(nextConfig)
