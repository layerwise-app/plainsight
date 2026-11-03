import { createFileRoute } from '@tanstack/react-router';
import { siteUrl } from '~/lib/site';

// Every page is public; only server endpoints stay out of search.
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          [
            'User-agent: *',
            'Disallow: /api/',
            'Disallow: /_serverFn/',
            '',
            `Sitemap: ${siteUrl('/sitemap.xml')}`,
            ''
          ].join('\n'),
          { headers: { 'content-type': 'text/plain; charset=utf-8' } }
        )
    }
  }
});
