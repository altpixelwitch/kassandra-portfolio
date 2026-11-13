import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const publicURL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : 'http://localhost:3000')

const publicOrigin = (() => {
  try {
    return new URL(publicURL)
  } catch {
    return undefined
  }
})()

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "img-src 'self' data: blob: https://images.unsplash.com https://translate.google.com https://translate.googleapis.com https://www.google.com https://*.gstatic.com",
  "media-src 'self' blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com https://*.gstatic.com",
  `script-src 'self' 'unsafe-inline'${
    process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"
  } https://www.googletagmanager.com https://translate.google.com https://*.googleapis.com https://*.gstatic.com`,
  "connect-src 'self' https: ws: wss:",
  "frame-src 'self' https://player.vimeo.com https://www.youtube.com https://www.youtube-nocookie.com https://translate.google.com",
  "worker-src 'self' blob:",
  'upgrade-insecure-requests',
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    const securityHeaders = [
      { key: 'Content-Security-Policy', value: contentSecurityPolicy },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-DNS-Prefetch-Control', value: 'off' },
      { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
      { key: 'X-Robots-Tag', value: 'noai, noimageai' },
      { key: 'TDM-Reservation', value: '1' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ]
    if (publicOrigin?.protocol === 'https:') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      })
    }

    return [
      { headers: securityHeaders, source: '/:path*' },
      {
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
        source: '/admin/:path*',
      },
      {
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
        source: '/api/:path*',
      },
      {
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
        source: '/preview/:path*',
      },
    ]
  },
  poweredByHeader: false,
  output: 'standalone',
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: { root: path.resolve(dirname) },
  typescript: { ignoreBuildErrors: true },
  enablePrerenderSourceMaps: false,
  experimental: {
    cpus: 2,
    serverActions: {
      allowedOrigins: publicOrigin ? [publicOrigin.host] : [],
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
