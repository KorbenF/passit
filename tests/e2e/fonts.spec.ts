import { test, expect } from '@playwright/test';

test.describe('Font loading & diacritics', () => {
  test('loads Lora Variable and Plus Jakarta Sans Variable for Slovak diacritics', async ({
    page,
  }) => {
    await page.goto('/');

    const testString = 'ľščťžýáíéúäôňďĺŕ';

    // Verify Lora Variable loads
    const loraLoaded = await page.evaluate(async (text) => {
      const faces = await document.fonts.load('16px "Lora Variable"', text);
      return faces.map((f) => ({
        family: f.family,
        status: f.status,
      }));
    }, testString);

    expect(loraLoaded.length).toBeGreaterThan(0);
    for (const font of loraLoaded) {
      expect(font.status).toBe('loaded');
    }

    // Verify Plus Jakarta Sans Variable loads
    const sansLoaded = await page.evaluate(async (text) => {
      const faces = await document.fonts.load(
        '16px "Plus Jakarta Sans Variable"',
        text
      );
      return faces.map((f) => ({
        family: f.family,
        status: f.status,
      }));
    }, testString);

    expect(sansLoaded.length).toBeGreaterThan(0);
    for (const font of sansLoaded) {
      expect(font.status).toBe('loaded');
    }

    // Capture screenshot of Slovak diacritics sample for PR evidence
    const sample = page.locator('[data-testid="diacritics-sample"]');
    await expect(sample).toBeVisible();
    await sample.screenshot({
      path: './tests/e2e/screenshots/diacritics-rendered.png',
    });
  });
});
