import type { MetadataRoute } from 'next';
import { sitemapPaths } from '@/lib/site';

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths.map((path) => ({ url: `${base}${path === '/' ? '' : path}` }));
}
