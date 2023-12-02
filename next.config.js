/** @type {import('next').NextConfig} */
const nodeAdminer = require('node-adminer');
const checkEnvVars = require('./scripts/checkMandatoryEnvVars');

if (process.env.START_ADMINER !== 'false') {
  checkEnvVars();
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

module.exports = nextConfig;
