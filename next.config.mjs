import { imageHosts } from './image-hosts.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVED: productionBrowserSourceMaps: true — was shipping source maps to browser (~large payload)
  distDir: process.env.DIST_DIR || '.next',

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
  },

  outputFileTracingExcludes: {
    '*': [
      '.next/server/edge-runtime-webpack.js',
    ],
  },

  images: {
    remotePatterns: imageHosts,
    // Enable modern image formats — Next.js will serve WebP/AVIF automatically
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive srcset generation
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize quality slightly for better compression (still premium quality)
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },

  // Cache headers for static assets
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/homepage',
        permanent: false,
      },
    ];
  }
};
export default nextConfig;