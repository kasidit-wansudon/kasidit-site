/**
 * Cloudflare Worker: kasi.kasion.dev
 *
 * Smart routing:
 * - curl → shell script installer
 * - browser → serve public/index.html
 */

import installScript from './install-script.js';

export default {
  async fetch(request, env) {
    const userAgent = request.headers.get('User-Agent') || '';
    const path = new URL(request.url).pathname;
    // Root only: a CLI client (curl/wget/fetch) lacks a browser UA token.
    const isBrowser = /Mozilla|AppleWebKit|Chrome|Safari|Firefox|Edg/i.test(userAgent);
    const isCurl = path === '/' && !isBrowser;

    if (isCurl) {
      // Terminal: return shell script (imported from ./install.sh)
      return new Response(installScript, {
        status: 200,
        headers: {
          'Content-Type': 'application/x-sh; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }
    return await env.ASSETS.fetch(request);
  },
};
