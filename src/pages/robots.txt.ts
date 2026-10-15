import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const appEnv = process.env.APP_ENV ?? 'preview';
  const siteUrl = site
    ? site.toString().replace(/\/$/, '')
    : 'https://passit.sk';

  const robotsContent =
    appEnv === 'production'
      ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
      : `User-agent: *\nDisallow: /\n`;

  return new Response(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
