import { test, expect } from '@playwright/test';

test.describe('Layout & Navigation', () => {
  test('renders header, main and footer without CSP violations', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const violations: string[] = [];
      Object.defineProperty(window, '__cspViolations', {
        value: violations,
        writable: false,
      });
      document.addEventListener('securitypolicyviolation', (e) => {
        violations.push(`${e.blockedURI} violated ${e.violatedDirective}`);
      });
    });

    await page.goto('/');

    await expect(page).toHaveTitle(/Passit/);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    const violations = await page.evaluate(() => {
      const v = Reflect.get(window, '__cspViolations');
      return Array.isArray(v) ? v : [];
    });
    expect(violations).toEqual([]);
  });

  test('mobile viewports (375px and 320px) have zero horizontal overflow and functional anchor links in drawer', async ({
    page,
  }) => {
    for (const width of [375, 320]) {
      await page.setViewportSize({ width, height: 812 });
      await page.goto('/');

      const hasOverflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
        );
      });
      expect(hasOverflow).toBe(false);

      if (width === 375) {
        await page.screenshot({
          path: './tests/e2e/screenshots/mobile-viewport.png',
        });
        await page.screenshot({
          path: './tests/e2e/screenshots/mobile-fullpage.png',
          fullPage: true,
        });
      }
    }

    // Open mobile drawer and click an anchor link -> drawer must close automatically
    await page.setViewportSize({ width: 375, height: 812 });
    const toggleBtn = page.locator('#mobile-nav-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    await toggleBtn.click();
    await expect(drawer).toBeVisible();
    await page.waitForTimeout(350);
    await page.screenshot({
      path: './tests/e2e/screenshots/mobile-menu-open.png',
    });

    await drawer.getByRole('link', { name: 'Katalóg' }).click();
    await expect(drawer).toBeHidden();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('404 page renders semantic structure and links', async ({ page }) => {
    const response = await page.goto('/404.html');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toContainText('Stránka sa nenašla');
    await expect(
      page.getByRole('link', { name: 'Späť na domovskú stránku' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Prejsť na sortiment' })
    ).toBeVisible();
  });
});
