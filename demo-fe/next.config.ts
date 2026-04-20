import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 后端 API 代理，解决开发阶段跨域问题
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
};

export default nextConfig;
