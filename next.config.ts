import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/projects/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old /work index page was merged into the landing. Keep the route redirecting
      // so shared links and crawl history still land somewhere meaningful.
      { source: "/work", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
