import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 后端 API 代理，解决开发阶段跨域问题
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://100.118.164.58:8080/:path*',
      },
    ];
  },
};

export default nextConfig;
