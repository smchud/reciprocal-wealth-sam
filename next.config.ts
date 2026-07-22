import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/concept-b", destination: "/", permanent: true },
      { source: "/concept-b/:path*", destination: "/:path*", permanent: true },
      { source: "/concept-a/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
