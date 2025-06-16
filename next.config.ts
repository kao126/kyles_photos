import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.S3_BUCKET_NAME}.s3.ap-northeast-1.amazonaws.com`,
        pathname: '**', // 任意の画像パスを許可
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // または '20mb', '50mb' など
    },
  },
};

export default nextConfig;
