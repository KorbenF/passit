import fs from 'node:fs';
import path from 'node:path';

export interface HeaderOptions {
  cspMode?: 'report-only' | 'enforce';
  appEnv?: 'production' | 'staging' | 'preview' | 'development';
  hstsPreload?: boolean;
}

export const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  'frame-src https://challenges.cloudflare.com',
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

function parseAppEnv(val: string | undefined): HeaderOptions['appEnv'] {
  if (
    val === 'production' ||
    val === 'staging' ||
    val === 'development' ||
    val === 'preview'
  ) {
    return val;
  }
  return undefined;
}

export function getSecurityHeaders(
  options: HeaderOptions = {}
): Record<string, string> {
  const cspMode =
    options.cspMode ??
    (process.env.CSP_MODE === 'enforce' ? 'enforce' : 'report-only');
  const appEnv =
    options.appEnv ?? parseAppEnv(process.env.APP_ENV) ?? 'preview';
  const hstsPreload =
    (options.hstsPreload ?? process.env.HSTS_PRELOAD === 'true') &&
    appEnv === 'production';

  const cspHeaderName =
    cspMode === 'enforce'
      ? 'Content-Security-Policy'
      : 'Content-Security-Policy-Report-Only';

  let hstsValue = 'max-age=63072000; includeSubDomains';
  if (hstsPreload) {
    hstsValue += '; preload';
  }

  const headers: Record<string, string> = {
    [cspHeaderName]: CSP_DIRECTIVES,
    'Strict-Transport-Security': hstsValue,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  };

  if (appEnv === 'staging' || appEnv === 'preview') {
    headers['X-Robots-Tag'] = 'noindex, nofollow';
  }

  return headers;
}

export function formatHeadersFile(
  existingContent: string,
  securityHeaders: Record<string, string>
): string {
  const securityHeaderLines = Object.entries(securityHeaders)
    .map(([key, value]) => `  ${key}: ${value}`)
    .join('\n');

  const globalRule = `/*\n${securityHeaderLines}`;

  const lines = existingContent.split(/\r?\n/);
  const blocks: { path: string; lines: string[] }[] = [];
  let currentBlock: { path: string; lines: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (!line.startsWith(' ') && !line.startsWith('\t')) {
      currentBlock = { path: trimmed, lines: [] };
      blocks.push(currentBlock);
    } else if (currentBlock) {
      currentBlock.lines.push(line);
    }
  }

  const otherBlocks = blocks.filter((b) => b.path !== '/*');
  const resultBlocks = [globalRule];
  for (const block of otherBlocks) {
    resultBlocks.push(`${block.path}\n${block.lines.join('\n')}`);
  }

  return resultBlocks.join('\n\n') + '\n';
}

export function generateHeaders(
  baseDir = path.resolve(process.cwd(), 'dist'),
  options: HeaderOptions = {}
): void {
  const targetDirs = [baseDir];
  const clientDir = path.join(baseDir, 'client');
  if (fs.existsSync(clientDir)) {
    targetDirs.push(clientDir);
  }

  const headers = getSecurityHeaders(options);

  for (const dir of targetDirs) {
    const headersPath = path.join(dir, '_headers');
    let existingContent = '';
    if (fs.existsSync(headersPath)) {
      existingContent = fs.readFileSync(headersPath, 'utf8');
    }

    const formatted = formatHeadersFile(existingContent, headers);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(headersPath, formatted, 'utf8');
    console.log(
      `[generate-headers] Successfully generated ${headersPath} (CSP: ${options.cspMode ?? process.env.CSP_MODE ?? 'report-only'})`
    );
  }
}

// Execute when run directly as CLI
if (
  process.argv[1] &&
  (process.argv[1].endsWith('generate-headers.ts') ||
    process.argv[1].endsWith('generate-headers.js'))
) {
  generateHeaders();
}
