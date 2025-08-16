/** @type {import('next').nextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // App directory is now stable in Next.js 14
  images: {
    unoptimized: true, // TEMP: bypass image optimization to fix Vercel thumbnail
    domains: ['www.google.com', 'google.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
      {
        protocol: 'https',
        hostname: 'google.com',
        pathname: '/s2/favicons/**',
      },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
    ],
  },
}

module.exports = nextConfig
