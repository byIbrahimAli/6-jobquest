import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@prisma/client', '.prisma/client'],
};

export default nextConfig;
