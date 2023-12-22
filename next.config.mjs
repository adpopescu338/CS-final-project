/** @type {import('next').NextConfig} */
import nodeAdminer from 'node-adminer';
import axios from 'axios';

if (process.env.START_ADMINER !== 'false') {
  nodeAdminer({
    port: 3015,
    open: false,
  });
}

setTimeout(async () => {
  try {
    await axios.get('http://localhost:3000/api/cron');
    console.log('Request to cron successful');
  } catch (e) {
    console.error(`Request to cron failed: ${e.message}`);
  }
}, 1000 * 5);

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
