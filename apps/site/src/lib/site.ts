/** Dev-only routes are served everywhere except a production build. */
export function isStyleguideEnabled(env: string | undefined): boolean {
  return env !== 'production';
}

/** Public pages for sitemap.xml. /styleguide is never listed. */
export const sitemapPaths = ['/'] as const;
