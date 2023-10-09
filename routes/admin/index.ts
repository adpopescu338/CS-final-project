import adminer from 'node-adminer';
import { ADMINER_PORT } from 'libs/constants/backend';
import { createProxyMiddleware } from 'http-proxy-middleware';

// start adminer server
adminer({
  port: ADMINER_PORT,
  open: false,
  theme: 'hydra',
});

// Create the proxy middleware
export const adminerProxy = createProxyMiddleware({
  target: `http://127.0.0.1:${ADMINER_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '/admin*': '', // remove /admin prefix
  },
  onError(err, req, res) {
    console.error(`Adminer proxy error: ${err.message}`);
    res.status(500).send('Proxy encountered an error.');
  },
});
