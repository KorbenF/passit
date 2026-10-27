import { test, expect } from '@playwright/test';

test.describe('Keyboard navigation', () => {
  test('Tab focuses skip link, then Enter activates jump to main', async ({
    page,
  }) => {
    await page.goto('/');

    // Press Tab from initial page load
    await page.keyboard.press('Tab');

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();

    // Press Enter to follow skip link
    await page.keyboard.press('Enter');

    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('mobile menu opens with Enter, closes with Esc, and returns focus to trigger', async ({
    page,
  }) => {
    // Set viewport to mobile so hamburger button is visible
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const toggleBtn = page.locator('#mobile-nav-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    await expect(toggleBtn).toBeVisible();
    await expect(drawer).toBeHidden();

    // Focus toggle button and press Enter
    await toggleBtn.focus();
    await expect(toggleBtn).toBeFocused();
    await page.keyboard.press('Enter');

    // Drawer should open and be visible
    await expect(drawer).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    // Close with Escape key
    await page.keyboard.press('Escape');

    // Drawer should close
    await expect(drawer).toBeHidden();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    // Focus should return to toggle button
    await expect(toggleBtn).toBeFocused();
  });
});
