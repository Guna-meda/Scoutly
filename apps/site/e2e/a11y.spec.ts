import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  { name: 'home', path: '/' },
  { name: 'styleguide', path: '/styleguide' },
  { name: 'privacy', path: '/privacy' },
  { name: 'terms', path: '/terms' },
  { name: 'cookies', path: '/cookies' },
  { name: 'data-deletion', path: '/data-deletion' },
  { name: 'security', path: '/security' },
  { name: '404', path: '/this-page-does-not-exist', status: 404 },
];
const widths = [375, 1280] as const;
const motions = ['no-preference', 'reduce'] as const;

for (const route of routes) {
  for (const width of widths) {
    for (const reducedMotion of motions) {
      test(`${route.name} @${width} motion=${reducedMotion}: no serious or critical axe violations`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.emulateMedia({ reducedMotion, colorScheme: 'light' });
        const response = await page.goto(route.path);
        expect(response?.status()).toBe(route.status ?? 200);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const bad = results.violations.filter(
          (v) => v.impact === 'serious' || v.impact === 'critical',
        );
        expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
      });
    }
  }
}

test('home: skip link is the first focusable element', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '#main');
});
