/** @type {import('next').NextConfig} */
import nodeAdminer from 'node-adminer';

if (process.env.START_ADMINER !== 'false') {
  nodeAdminer({
    port: 3015,
    open: false,
  });
}

const nextConfig = {
  reactStrictMode: true,
  rewrites: () => [
    {
      source: '/admin/:path*',
      destination: 'http://127.0.0.1:3015/:path*',
    },
  ],
};

export default nextConfig;