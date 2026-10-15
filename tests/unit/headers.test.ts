import { describe, expect, it } from 'vitest';
import {
  getSecurityHeaders,
  CSP_DIRECTIVES,
  formatHeadersFile,
} from '../../scripts/generate-headers';

describe('Security headers generator', () => {
  it('generates all mandatory B.5 headers in report-only mode by default', () => {
    const headers = getSecurityHeaders({
      cspMode: 'report-only',
      appEnv: 'staging',
    });

    expect(headers['Content-Security-Policy-Report-Only']).toBe(CSP_DIRECTIVES);
    expect(headers['Content-Security-Policy']).toBeUndefined();
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');
    expect(headers['Permissions-Policy']).toContain('camera=()');
    expect(headers['Strict-Transport-Security']).toBe(
      'max-age=63072000; includeSubDomains'
    );
    expect(headers['Strict-Transport-Security']).not.toContain('preload');
  });

  it('generates Content-Security-Policy header when cspMode is enforce', () => {
    const headers = getSecurityHeaders({
      cspMode: 'enforce',
      appEnv: 'production',
    });

    expect(headers['Content-Security-Policy']).toBe(CSP_DIRECTIVES);
    expect(headers['Content-Security-Policy-Report-Only']).toBeUndefined();
  });

  it('does not send HSTS preload in preview or staging', () => {
    const stagingHeaders = getSecurityHeaders({
      appEnv: 'staging',
      hstsPreload: true,
    });
    expect(stagingHeaders['Strict-Transport-Security']).toBe(
      'max-age=63072000; includeSubDomains'
    );
    expect(stagingHeaders['Strict-Transport-Security']).not.toContain(
      'preload'
    );

    const previewHeaders = getSecurityHeaders({
      appEnv: 'preview',
      hstsPreload: true,
    });
    expect(previewHeaders['Strict-Transport-Security']).toBe(
      'max-age=63072000; includeSubDomains'
    );
    expect(previewHeaders['Strict-Transport-Security']).not.toContain(
      'preload'
    );
  });

  it('includes HSTS preload in production only when explicitly enabled', () => {
    const prodHeaders = getSecurityHeaders({
      appEnv: 'production',
      hstsPreload: true,
    });
    expect(prodHeaders['Strict-Transport-Security']).toBe(
      'max-age=63072000; includeSubDomains; preload'
    );
  });

  it('adds X-Robots-Tag: noindex, nofollow on staging and preview', () => {
    const stagingHeaders = getSecurityHeaders({ appEnv: 'staging' });
    expect(stagingHeaders['X-Robots-Tag']).toBe('noindex, nofollow');

    const previewHeaders = getSecurityHeaders({ appEnv: 'preview' });
    expect(previewHeaders['X-Robots-Tag']).toBe('noindex, nofollow');

    const prodHeaders = getSecurityHeaders({ appEnv: 'production' });
    expect(prodHeaders['X-Robots-Tag']).toBeUndefined();
  });

  it('formats headers into Cloudflare _headers format preserving existing asset cache headers', () => {
    const existing =
      '/_astro/*\n  cache-control: public, max-age=31536000, immutable';
    const securityHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
    };

    const formatted = formatHeadersFile(existing, securityHeaders);
    expect(formatted).toContain(
      '/*\n  X-Frame-Options: DENY\n  X-Content-Type-Options: nosniff'
    );
    expect(formatted).toContain(
      '/_astro/*\n  cache-control: public, max-age=31536000, immutable'
    );
  });
});
