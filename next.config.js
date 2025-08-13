/** @type {import('next').nextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  images: {
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
    ],
  },
}

module.exports = nextConfig
