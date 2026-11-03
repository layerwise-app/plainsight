import { createFileRoute } from '@tanstack/react-router';
import { projects } from '~/content';
import { sitemapPaths, siteUrl } from '~/lib/site';

// Lists `sitemapPaths` and one page per case study in `src/content/work/`.
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const urls = [...sitemapPaths, ...projects.map((project) => `/work/${project.slug}`)]
          .map((path) => `  <url><loc>${escapeXml(siteUrl(path))}</loc></url>`)
          .join('\n');
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
          { headers: { 'content-type': 'application/xml; charset=utf-8' } }
        );
      }
    }
  }
});

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
