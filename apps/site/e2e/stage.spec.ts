import { expect, test } from '@playwright/test';

test.describe('pinned stage (desktop)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('next, previous and dots change the screen and the announcement', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/#how-it-works');
    const status = page.locator('.stage-pin').getByRole('status');
    await expect(page.locator('.stage-pin')).toBeVisible();
    // Align the wrapper top with the header so the stage starts pinned on step 1.
    await page.evaluate(() => {
      const el = document.querySelector('.stage-pin') as HTMLElement;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 64);
    });
    await page.waitForTimeout(300);
    await expect(page.locator('.stage-pin .screen[data-state="active"]:visible')).toHaveAttribute(
      'data-screen',
      '0',
    );

    await page.getByRole('button', { name: 'Next step' }).click();
    await expect(page.locator('.stage-pin .screen[data-state="active"]:visible')).toHaveAttribute(
      'data-screen',
      '1',
    );
    await expect(status).toContainText('Step 2 of 3:');

    await page.getByRole('button', { name: 'Go to step 3' }).click();
    await expect(page.locator('.stage-pin .screen[data-state="active"]:visible')).toHaveAttribute(
      'data-screen',
      '2',
    );
    await expect(page.getByRole('button', { name: 'Go to step 3' })).toHaveAttribute(
      'aria-current',
      'step',
    );
    await expect(page.getByRole('button', { name: 'Next step' })).toBeDisabled();

    await page.getByRole('button', { name: 'Previous step' }).click();
    await expect(page.locator('.stage-pin .screen[data-state="active"]:visible')).toHaveAttribute(
      'data-screen',
      '1',
    );
  });

  test('reduced motion shows three stacked frames', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.stage-pin')).toBeHidden();
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

for (const [width, height] of [
  [390, 844],
  [375, 667],
  [360, 640],
] as const) {
  test(`scroll through the pinned stage at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const sticky = page.locator('.stage-sticky');
    await expect(sticky).toBeVisible();
    const top = await page.evaluate(
      () =>
        (document.querySelector('.stage-pin') as HTMLElement).getBoundingClientRect().top + scrollY,
    );
    const stepLen = height * 0.7;
    const seen: number[] = [];
    for (const off of [10, stepLen, stepLen * 2]) {
      await page.evaluate((y) => window.scrollTo(0, y), top - 64 + off);
      await page.waitForTimeout(700);
      const r = await page.evaluate(() => {
        const s = document.querySelector('.stage-sticky') as HTMLElement;
        const b = s.getBoundingClientRect();
        const dev = [...document.querySelectorAll('.device')].find(
          (d) => d.closest('.stage-pin') && d.getBoundingClientRect().width > 0,
        ) as HTMLElement;
        const body = dev.querySelector('.screen[data-state="active"]') as HTMLElement;
        const lastChild = body.lastElementChild as HTMLElement;
        return {
          top: b.top,
          bottom: b.bottom,
          vh: innerHeight,
          beat: Number(body.dataset.screen),
          clipped:
            lastChild.getBoundingClientRect().bottom > body.getBoundingClientRect().bottom + 0.5,
          scrollOverflow: body.scrollHeight > body.clientHeight + 1,
          hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });
      seen.push(r.beat);
      expect(r.top).toBeGreaterThanOrEqual(0);
      expect(r.bottom).toBeLessThanOrEqual(r.vh + 1);
      expect(r.clipped, `beat ${r.beat} last element clipped`).toBe(false);
      expect(r.scrollOverflow, `beat ${r.beat} content taller than screen`).toBe(false);
      expect(r.hscroll).toBe(false);
    }
    expect(seen).toEqual([0, 1, 2]);
  });
}

for (const [width, height] of [
  [390, 844],
  [1280, 800],
] as const) {
  test(`no layout shift on load at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[])
          if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto('/');
    await page.waitForTimeout(1200);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.02);
  });
}

test('without JS the stacked layout shows', async ({ browser }) => {
  const ctx = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3100/');
  await expect(page.locator('.stage-stacked')).toBeVisible();
  await expect(page.locator('.stage-pin')).toBeHidden();
  await ctx.close();
});

for (const [width, height] of [
  [1280, 800],
  [390, 844],
] as const) {
  test(`paper plane send reaches Sent, replays, and has no horizontal scroll at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const pin = page.locator('.stage-pin');
    await expect(pin).toBeVisible();
    const top = await page.evaluate(
      () =>
        (document.querySelector('.stage-pin') as HTMLElement).getBoundingClientRect().top + scrollY,
    );
    await page.evaluate((y) => window.scrollTo(0, y), top - 64 + height * 0.7 * 2 + 5);
    await expect(pin).toHaveAttribute('data-send', 'sending', { timeout: 6000 });
    await expect(pin).toHaveAttribute('data-send', 'sent', { timeout: 12000 });
    const replay = page.locator('.replay:visible');
    await expect(replay).toBeEnabled({ timeout: 6000 });
    await replay.click();
    await expect(pin).toHaveAttribute('data-send', 'sending', { timeout: 6000 });
    await expect(pin).toHaveAttribute('data-send', 'sent', { timeout: 12000 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
}

test('reduced motion shows the sent state without the animation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.stage-pin')).toBeHidden();
  await expect(page.locator('.stage-stacked .lbl-sent').first()).toBeVisible();
  await expect(page.locator('.pp-overlay')).toHaveCount(0);
});
