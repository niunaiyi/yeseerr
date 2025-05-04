import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'media.themoviedb.org',
      },
      {
        protocol: 'http',
        hostname: '192.168.2.102',
        port: '7878',
      },
      {
        protocol: 'https',  
        hostname: 'www.themoviedb.org',
      },
    ],
  },
  allowedDevOrigins: [
    '192.168.2.*', '192.168.2.102:7878'
  ]
};

export default nextConfig;
