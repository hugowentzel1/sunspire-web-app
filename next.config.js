/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://sunspire-web-app.vercel.app' : '',
  basePath: '',
}

module.exports = nextConfig
