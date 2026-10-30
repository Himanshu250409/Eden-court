/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three / drei ship ESM that Next must transpile
  transpilePackages: ["three"],
};
export default nextConfig;
