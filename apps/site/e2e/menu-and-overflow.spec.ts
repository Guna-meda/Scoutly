import { expect, test } from '@playwright/test';

test('phone menu works by keyboard: open, focus moves in, Esc closes and returns focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/');

  const summary = page.locator('#mobile-menu > summary');
  const firstLink = page.locator('#mobile-menu .menu-panel a').first();
  // Wait for the JS enhancement (it marks nothing visible, so wait for hydration via inert toggle).
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#mobile-menu')).toHaveAttribute('open', '');
  await expect(firstLink).toBeFocused();
  await expect(page.locator('#main')).toHaveJSProperty('inert', true);

  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
  await expect(page.locator('#main')).toHaveJSProperty('inert', false);

  // Space opens it too.
  await page.keyboard.press('Space');
  await expect(page.locator('#mobile-menu')).toHaveAttribute('open', '');
});

test('no horizontal scroll at 375 and 320', async ({ page }) => {
  for (const width of [375, 320]) {
    for (const path of ['/', '/styleguide']) {
      await page.setViewportSize({ width, height: 700 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow, `${path} @${width}`).toBe(false);
    }
  }
});
