/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import type * as React from 'react';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { NotFound } from '~/components/NotFound';
import { SiteFooter } from '~/components/site/SiteFooter';
import { SiteHeader } from '~/components/site/SiteHeader';
import { site } from '~/lib/site';
import { preloadFont, themeCss } from '~/lib/theme';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';
import appCss from '~/styles/app.css?url';

export const Route = createRootRoute({
  // Site-wide defaults; each page's `seo()` overrides tags with the same name.
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: portfolio.colors.background },
      ...(site.googleSiteVerification
        ? [{ name: 'google-site-verification', content: site.googleSiteVerification }]
        : []),
      ...seo({ title: site.name, description: site.description }).meta
    ],
    links: [
      ...(preloadFont
        ? [{ rel: 'preload', href: preloadFont, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' as const }]
        : []),
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' }
    ]
  }),
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
  component: RootComponent
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        {/* Font faces and colours from src/portfolio.config.ts. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: built from the config at build time */}
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <HeadContent />
      </head>
      <body>
        <a
          href='#main'
          className='sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:h-auto focus:w-auto focus:bg-ink focus:px-3 focus:py-2 focus:text-ui focus:text-paper'
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id='main'>{children}</main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}
