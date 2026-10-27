import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

interface CheckError {
  file: string;
  message: string;
}

const errors: CheckError[] = [];

function reportError(file: string, message: string): void {
  errors.push({ file, message });
}

const DIST_DIR = path.resolve('dist');
const CLIENT_DIR = path.join(DIST_DIR, 'client');

if (!fs.existsSync(DIST_DIR)) {
  console.error(
    `[check-dist] Error: Directory ${DIST_DIR} does not exist. Run "pnpm build" first.`
  );
  process.exit(1);
}

const rootDir = fs.existsSync(CLIENT_DIR) ? CLIENT_DIR : DIST_DIR;

// 1. Secret patterns scan
const SECRET_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: 'Resend API Key', pattern: /re_[a-zA-Z0-9]{20,}/ },
  { name: 'Turnstile Secret Key', pattern: /0x4AAA[a-zA-Z0-9_-]{20,}/ },
  { name: 'Private Key header', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'Server env var RESEND_API_KEY', pattern: /RESEND_API_KEY\s*[:=]/ },
  {
    name: 'Server env var TURNSTILE_SECRET_KEY',
    pattern: /TURNSTILE_SECRET_KEY\s*[:=]/,
  },
  {
    name: 'Server env var CLOUDFLARE_API_TOKEN',
    pattern: /CLOUDFLARE_API_TOKEN\s*[:=]/,
  },
];

function scanFilesRecursively(dir: string, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanFilesRecursively(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allDistFiles = scanFilesRecursively(DIST_DIR);

for (const filePath of allDistFiles) {
  const ext = path.extname(filePath);
  if (['.html', '.js', '.css', '.json', '.txt'].includes(ext)) {
    const content = fs.readFileSync(filePath, 'utf8');

    for (const { name, pattern } of SECRET_PATTERNS) {
      if (pattern.test(content)) {
        reportError(filePath, `Found secret pattern: ${name}`);
      }
    }

    if (
      process.env.PUBLIC_ENV === 'production' &&
      content.includes('PLACEHOLDER')
    ) {
      reportError(filePath, 'Found PLACEHOLDER in production build');
    }
  }
}

// 2. HTML inspections (inline scripts, inline styles, style=, on*=, external hosts)
const ALLOWED_EXTERNAL_HOSTS = [
  'challenges.cloudflare.com',
  'static.cloudflareinsights.com',
  'cloudflareinsights.com',
];

const htmlFiles = allDistFiles.filter((f) => f.endsWith('.html'));

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const relativeFile = path.relative(DIST_DIR, htmlFile);

  // Check for inline <script> without src (except application/ld+json)
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null = scriptRegex.exec(html);
  while (match !== null) {
    const attrs = match[1] ?? '';
    const body = (match[2] ?? '').trim();
    const isLdJson = /type=["']application\/ld\+json["']/i.test(attrs);
    const hasSrc = /src=["'][^"']+["']/i.test(attrs);

    if (!hasSrc && !isLdJson && body.length > 0) {
      reportError(
        relativeFile,
        `Inline <script> found: ${body.slice(0, 80)}...`
      );
    }
    match = scriptRegex.exec(html);
  }

  // Check for inline <style>
  if (/<style\b[^>]*>/i.test(html)) {
    reportError(relativeFile, 'Inline <style> tag found');
  }

  // Check for style="..." attributes
  if (/\sstyle=["'][^"']*["']/i.test(html)) {
    reportError(relativeFile, 'Inline style="..." attribute found');
  }

  // Check for on*="..." event handlers
  if (/\son[a-z]+=["'][^"']*["']/i.test(html)) {
    reportError(relativeFile, 'Inline on*="..." event handler attribute found');
  }

  // Check external hosts in src or href
  const externalUrlRegex = /(?:src|href)=["'](https?:\/\/[^"'/]+)/gi;
  let urlMatch: RegExpExecArray | null = externalUrlRegex.exec(html);
  while (urlMatch !== null) {
    const rawHost = urlMatch[1];
    if (rawHost) {
      try {
        const url = new URL(rawHost);
        if (!ALLOWED_EXTERNAL_HOSTS.includes(url.hostname)) {
          reportError(
            relativeFile,
            `External host not whitelisted: ${url.hostname}`
          );
        }
      } catch {
        // invalid URL
      }
    }
    urlMatch = externalUrlRegex.exec(html);
  }

  // Check <img> tags: must come from astro:assets (/_astro/*.webp|.avif|.svg) and have width & height
  const imgTagRegex = /<img\b([^>]*)>/gi;
  let imgMatch: RegExpExecArray | null = imgTagRegex.exec(html);
  while (imgMatch !== null) {
    const attrs = imgMatch[1] ?? '';
    const srcMatch = /\bsrc=["']([^"']+)["']/i.exec(attrs);
    const src = srcMatch?.[1] ?? '';
    const hasWidth = /\bwidth=["']\d+["']/i.test(attrs);
    const hasHeight = /\bheight=["']\d+["']/i.test(attrs);

    if (!hasWidth || !hasHeight) {
      reportError(
        relativeFile,
        `<img> tag missing explicit width/height attributes: ${src}`
      );
    }

    const cleanSrc = src.split('?')[0]?.split('#')[0] ?? '';
    if (
      !cleanSrc.startsWith('/_astro/') ||
      !/\.(?:webp|avif|svg)$/i.test(cleanSrc)
    ) {
      reportError(
        relativeFile,
        `<img> must be optimized via astro:assets (/_astro/*.webp|.avif|.svg), found: ${src}`
      );
    }

    imgMatch = imgTagRegex.exec(html);
  }
}

// 3. Fonts validation (unicode-range latin-ext U+0100-02BA, woff2 existence, count <= 4, total size <= 120 KB)
const fontFiles = allDistFiles.filter((f) => f.endsWith('.woff2'));
if (fontFiles.length > 4) {
  reportError(
    'fonts',
    `Found ${fontFiles.length} woff2 font files, maximum allowed is 4`
  );
}

let totalFontSize = 0;
for (const fontFile of fontFiles) {
  const stat = fs.statSync(fontFile);
  totalFontSize += stat.size;
}

const MAX_FONT_BYTES = 120 * 1024;
if (totalFontSize > MAX_FONT_BYTES) {
  reportError(
    'fonts',
    `Total font size is ${(totalFontSize / 1024).toFixed(1)} KB, exceeding budget of 120 KB`
  );
}

const cssFiles = allDistFiles.filter((f) => f.endsWith('.css'));
let hasLatinExtRange = false;
const referencedFonts: string[] = [];

for (const cssFile of cssFiles) {
  const css = fs.readFileSync(cssFile, 'utf8');

  // Check unicode-range for latin-ext (U+0100-02BA or minified U+100-2BA)
  if (/unicode-range:[^;]*U\+0?100-0?2BA/i.test(css)) {
    hasLatinExtRange = true;
  }

  // Find all url(...) references to woff2
  const fontUrlRegex = /url\(['"]?([^'")]+?\.woff2)['"]?\)/gi;
  let fontMatch: RegExpExecArray | null = fontUrlRegex.exec(css);
  while (fontMatch !== null) {
    const fontRef = fontMatch[1];
    if (fontRef) {
      referencedFonts.push(fontRef);
    }
    fontMatch = fontUrlRegex.exec(css);
  }
}

if (!hasLatinExtRange) {
  reportError(
    'css',
    '@font-face in built CSS does not contain unicode-range covering latin-ext (U+0100-02BA)'
  );
}

for (const ref of referencedFonts) {
  // Resolve ref relative to dist or root
  const cleanRef = ref.split('?')[0]?.split('#')[0] ?? '';
  const basename = path.basename(cleanRef);
  const exists = fontFiles.some((f) => path.basename(f) === basename);
  if (!exists) {
    reportError('css', `Referenced font file does not exist in build: ${ref}`);
  }
}

// 4. JS budget on '/' (<= 10 KB gzip)
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const jsSrcRegex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let jsMatch: RegExpExecArray | null = jsSrcRegex.exec(indexHtml);
  let totalJsGzip = 0;

  while (jsMatch !== null) {
    const src = jsMatch[1];
    if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
      const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
      const targetPath = path.join(rootDir, cleanSrc);
      if (fs.existsSync(targetPath)) {
        const fileContent = fs.readFileSync(targetPath);
        const gzipped = zlib.gzipSync(fileContent);
        totalJsGzip += gzipped.length;
      }
    }
    jsMatch = jsSrcRegex.exec(indexHtml);
  }

  const MAX_JS_GZIP = 10 * 1024;
  if (totalJsGzip > MAX_JS_GZIP) {
    reportError(
      'index.html',
      `Total JS on "/" is ${(totalJsGzip / 1024).toFixed(1)} KB (gzip), exceeding 10 KB budget`
    );
  }
}

// 5. Output results
if (errors.length > 0) {
  console.error('\n[check-dist] FAILED with the following errors:');
  for (const err of errors) {
    console.error(`  - ${err.file}: ${err.message}`);
  }
  process.exit(1);
} else {
  console.log(
    `[check-dist] PASSED: All checks green (${htmlFiles.length} HTML files, ${fontFiles.length} fonts [${(totalFontSize / 1024).toFixed(1)} KB], 0 inline scripts/styles, 0 secrets).`
  );
}
