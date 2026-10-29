import { describe, expect, it } from 'vitest';
import { siteConfig, siteSchema } from '../../src/lib/site';

describe('siteConfig', () => {
  it('conforms to siteSchema', () => {
    const parsed = siteSchema.safeParse(siteConfig);
    expect(parsed.success).toBe(true);
  });

  it('contains valid email address', () => {
    expect(siteConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('contains non-empty required fields', () => {
    expect(siteConfig.name.length).toBeGreaterThan(0);
    expect(siteConfig.legalName.length).toBeGreaterThan(0);
    expect(siteConfig.phone.length).toBeGreaterThan(0);
    expect(siteConfig.phoneDisplay.length).toBeGreaterThan(0);
    expect(siteConfig.openingHours.length).toBeGreaterThan(0);
    expect(siteConfig.deliveryArea.length).toBeGreaterThan(0);
  });
});
