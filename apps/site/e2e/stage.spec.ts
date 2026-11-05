import { expect, test } from '@playwright/test';

test.describe('pinned stage (desktop)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('next, previous and dots change the screen and the announcement', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/#how-it-works');
    const status = page.getByRole('status');
    await expect(page.locator('.stage-pin')).toBeVisible();
    // Align the wrapper top with the header so the stage starts pinned on step 1.
    await page.evaluate(() => {
      const el = document.querySelector('.stage-pin') as HTMLElement;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 64);
    });
    await page.waitForTimeout(300);
    await expect(page.locator('.screen[data-state="active"]')).toHaveAttribute('data-screen', '0');

    await page.getByRole('button', { name: 'Next step' }).click();
    await expect(page.locator('.screen[data-state="active"]')).toHaveAttribute('data-screen', '1');
    await expect(status).toContainText('Step 2 of 3:');

    await page.getByRole('button', { name: 'Go to step 3' }).click();
    await expect(page.locator('.screen[data-state="active"]')).toHaveAttribute('data-screen', '2');
    await expect(page.getByRole('button', { name: 'Go to step 3' })).toHaveAttribute(
      'aria-current',
      'step',
    );
    await expect(page.getByRole('button', { name: 'Next step' })).toBeDisabled();

    await page.getByRole('button', { name: 'Previous step' }).click();
    await expect(page.locator('.screen[data-state="active"]')).toHaveAttribute('data-screen', '1');
  });

  test('reduced motion shows three stacked frames', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.stage-pin')).toHaveCount(0);
    await expect(page.locator('.stage-stacked .device')).toHaveCount(3);
  });
});

for (const width of [320, 375]) {
  test(`no horizontal scroll at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
