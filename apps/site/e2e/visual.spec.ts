import { expect, test } from '@playwright/test';

/**
 * Stage screenshot scaffolding (DOCS: ACCESSIBILITY_AND_PERFORMANCE.md section 3 item 4).
 * No baselines are committed in W00. The stage does not exist yet (W01+), so this captures `/`.
 * Create or update baselines deliberately with:
 *   pnpm test:visual --update-snapshots
 * Never auto-accept. Until baselines exist, the spec is skipped.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const baselineDir = join(process.cwd(), 'e2e', '__screenshots__');
const hasBaselines = existsSync(baselineDir) || process.argv.includes('--update-snapshots');

const widths = [375, 768, 1280, 1920] as const;
const motions = ['no-preference', 'reduce'] as const;

for (const width of widths) {
  for (const reducedMotion of motions) {
    test(`home @${width} motion=${reducedMotion}`, async ({ page }) => {
      test.skip(!hasBaselines, 'no baselines committed yet (W00); run with --update-snapshots');
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion, colorScheme: 'light' });
      await page.goto('/');
      await expect(page).toHaveScreenshot(`home-${width}-${reducedMotion}.png`, {
        fullPage: false,
      });
    });
  }
}
