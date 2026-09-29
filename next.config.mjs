/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/tools/:slug',
        destination: '/health-tools/:slug',
        permanent: true,
      },
      {
        source: '/tools',
        destination: '/health-tools',
        permanent: true,
      },
      {
        source: '/categories/:slug',
        destination: '/category/:slug',
        permanent: true,
      },
      {
        source: '/categories',
        destination: '/news',
        permanent: true,
      },
      {
        source: '/articles/:slug',
        destination: '/article/:slug',
        permanent: true,
      },
      {
        source: '/articles',
        destination: '/news',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

