import { expect, test } from '@playwright/test';

test('Tab never lands inside the device, and inactive screens are inert', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/styleguide');

  const inactive = page.locator('.screen[data-state="before"], .screen[data-state="after"]');
  expect(await inactive.count()).toBeGreaterThan(0);
  for (const el of await inactive.all()) await expect(el).toHaveJSProperty('inert', true);

  const insideDevice = [];
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab');
    insideDevice.push(
      await page.evaluate(() => Boolean(document.activeElement?.closest('.device'))),
    );
  }
  expect(insideDevice.some(Boolean)).toBe(false);
});
