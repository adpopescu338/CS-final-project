import { ADMINER_PORT } from 'libs/constants/backend';
import { createProxyMiddleware } from 'http-proxy-middleware';

const withAdminer = process.env.WITH_ADMINER !== 'false';

if (withAdminer) {
  import('node-adminer').then((adminer) => {
    // start adminer server
    adminer.default({
      port: ADMINER_PORT,
      open: false,
      theme: 'hydra',
    });
  });
}

// Create the proxy middleware
export const adminerProxy = withAdminer
  ? createProxyMiddleware({
      target: `http://127.0.0.1:${ADMINER_PORT}`,
      changeOrigin: true,
      pathRewrite: {
        '/admin*': '', // remove /admin prefix
      },
      onError(err, req, res) {
        console.error(`Adminer proxy error: ${err.message}`);
        res.status(500).send('Proxy encountered an error.');
      },
    })
  : (req, res) => {
      res.status(500).json({ Message: 'Adminer disabled. Check your env variables' });
    };
