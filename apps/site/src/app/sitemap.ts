import type { MetadataRoute } from 'next';
import { sitemapPaths } from '@/lib/site';
import { siteUrl } from '@/lib/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths.map((path) => ({ url: `${siteUrl}${path === '/' ? '' : path}` }));
}
