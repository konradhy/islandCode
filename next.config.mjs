

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
   async rewrites() {
    return [
      {
        source: '/office-addin/:path*',
        destination: '/office-addin/:path*',
      },
    ];
  },
};

export default nextConfig;