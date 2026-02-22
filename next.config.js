/** @type {import('next').NextConfig} */
const nextConfig = {
  // Files placed in /public are served statically at the root path.
  // /public/uploads/* is accessible at /uploads/* with no extra config needed.

  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-left",
  },

  images: {
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        // Long-lived cache for uploaded images
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
