import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/v2", destination: "/v2/android", permanent: true },
      { source: "/v2/ja", destination: "/v2/android/ja", permanent: true },
      { source: "/v2/ko", destination: "/v2/android/ko", permanent: true },
    ];
  },
};

export default nextConfig;
