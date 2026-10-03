/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/cpanel',
        destination: '/admin',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
