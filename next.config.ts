import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.CLOUDFRONT_DOMAIN!,
        pathname: '**', // 任意の画像パスを許可
      },
    ],
  },
};

export default nextConfig;
