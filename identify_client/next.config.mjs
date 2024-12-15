/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
