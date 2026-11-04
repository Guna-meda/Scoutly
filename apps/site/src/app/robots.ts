import type { MetadataRoute } from 'next';
import { isProduction } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  return isProduction
    ? { rules: { userAgent: '*', allow: '/' } }
    : { rules: { userAgent: '*', disallow: '/' } };
}
