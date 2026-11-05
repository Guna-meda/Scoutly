import { describe, expect, it } from 'vitest';
import { isStyleguideEnabled, sitemapPaths } from './site';

describe('site', () => {
  it('serves /styleguide everywhere except production', () => {
    expect(isStyleguideEnabled('production')).toBe(false);
    expect(isStyleguideEnabled('staging')).toBe(true);
    expect(isStyleguideEnabled(undefined)).toBe(true);
  });
  it('never lists /styleguide in the sitemap', () => {
    expect(sitemapPaths.some((p) => p.includes('styleguide'))).toBe(false);
  });
});
