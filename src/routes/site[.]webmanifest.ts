import { createFileRoute } from '@tanstack/react-router';
import { portfolio } from '~/portfolio.config';

// The web app manifest, built from the studio's name and colours.
export const Route = createFileRoute('/site.webmanifest')({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          {
            name: portfolio.name,
            short_name: portfolio.name,
            icons: [
              { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
              { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
              { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
            ],
            theme_color: portfolio.colors.background,
            background_color: portfolio.colors.background,
            display: 'standalone'
          },
          { headers: { 'content-type': 'application/manifest+json; charset=utf-8' } }
        )
    }
  }
});
