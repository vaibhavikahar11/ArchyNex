/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Enable experimental features if needed
  experimental: {
    // Enable if you want to use app directory in the future
    // appDir: true,
  },
  // Webpack configuration for handling SVGs and other assets
  webpack: (config, { isServer }) => {
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
