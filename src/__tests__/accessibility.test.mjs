/**
 * Accessibility Testing Suite
 * Tests WCAG 2.1 Level AA compliance using axe-core
 *
 * Requirements: a running dev server at http://127.0.0.1:8080 and Chrome/Chromium available.
 * Without Chrome the suite reports as SKIPPED (an environment limit, e.g. CI without a
 * browser). Without the server it FAILS, because this repo controls that side —
 * shell_scripts/test_with_server.sh starts one, runs the suite and tears it down.
 *
 * Every page the site actually serves is covered by the shared checks below.
 * Adding a page to PAGES is all it takes to hold it to the same bar; the
 * homepage keeps a few extra tests because it is the only page with a form.
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { AxePuppeteer } from 'axe-puppeteer';
import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:8080';

// WCAG 2.1 AA. All four pages pass at this level today, so a regression here
// is a real defect rather than a pre-existing gap being surfaced.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const PAGES = [
  { name: 'homepage (/)', path: '/', lang: 'pt-BR' },
  { name: 'resume (/cv/)', path: '/cv/', lang: 'pt-BR' },
  { name: 'experience (/experiencia/)', path: '/experiencia/', lang: 'pt-BR' },
  { name: 'projects (/projetos/)', path: '/projetos/', lang: 'pt-BR' },
  { name: 'English portfolio (/en/)', path: '/en/', lang: 'en' },
  { name: 'English experience (/en/experience/)', path: '/en/experience/', lang: 'en' },
  { name: 'English projects (/en/projects/)', path: '/en/projects/', lang: 'en' },
  { name: 'Singularity (/en/singularity/)', path: '/en/singularity/', lang: 'en' },
];

// Probed before the suite is defined, so the result can choose between running,
// skipping and failing. Guarding inside each test with a bare `return` — what
// this file did before — reports it as PASSED without having tested anything,
// which is the one outcome a capability check must never produce.
let browser = null;
let launchError = null;
try {
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
} catch (err) {
  launchError = err;
}

if (!browser) {
  const reason = String(launchError?.message ?? launchError).split('\n')[0];
  // process.stderr, not console.warn: Jest captures a test file's console and
  // prints it with that file's results, so a skipped suite's console output is
  // never shown \u2014 leaving "26 skipped" on screen with no reason attached.
  process.stderr.write(
    `\nAccessibility suite SKIPPED \u2014 Chrome could not be launched.\n  ${reason}\n` +
      '  Install Chrome/Chromium, or point PUPPETEER_EXECUTABLE_PATH at an existing binary.\n\n',
  );
}

// describe.skip reports as "skipped" in Jest's summary, which is visible.
// A passing test that did nothing is not.
const describeIfBrowser = browser ? describe : describe.skip;

describeIfBrowser('Accessibility Tests', () => {
  let page;

  beforeAll(async () => {
    // One clear failure beats 26 ERR_CONNECTION_REFUSED stack traces.
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5000) }).catch((err) => {
      throw new Error(
        `No dev server is answering ${BASE_URL} (${err.message}). ` +
          'Start one, or run ./shell_scripts/test_with_server.sh which does it for you.',
      );
    });
    if (!res.ok) {
      throw new Error(`${BASE_URL} answered ${res.status}; the suite needs a 2xx.`);
    }
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  const open = (path) => page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle0' });

  describe.each(PAGES)('$name', ({ path, lang }) => {
    it('should pass axe accessibility tests', async () => {
      await open(path);

      const results = await new AxePuppeteer(page).withTags(WCAG_TAGS).analyze();

      expect(results.violations).toHaveLength(0);
    }, 30000);

    it('should have proper semantic HTML structure', async () => {
      await open(path);

      expect(await page.$('main')).toBeTruthy();
      expect(await page.$('nav[role="navigation"]')).toBeTruthy();
      expect(await page.$('footer[role="contentinfo"]')).toBeTruthy();
    }, 30000);

    it(`should declare lang="${lang}" on the html element`, async () => {
      await open(path);

      expect(await page.$eval('html', (el) => el.getAttribute('lang'))).toBe(lang);
    }, 30000);

    it('should have exactly one h1', async () => {
      await open(path);

      expect(await page.$$eval('h1', (els) => els.length)).toBe(1);
    }, 30000);

    it('should have alt text on all images', async () => {
      await open(path);

      // An empty alt is correct -- and required -- for decorative images, so long
      // as they are also hidden from assistive tech via role="presentation"/"none"
      // or aria-hidden. Only count images that are meant to convey something and
      // fail to describe it.
      const imagesWithoutAlt = await page.$$eval(
        'img',
        (imgs) =>
          imgs.filter((img) => {
            const role = img.getAttribute('role');
            const decorative =
              role === 'presentation' ||
              role === 'none' ||
              img.getAttribute('aria-hidden') === 'true';
            if (decorative) {
              return false;
            }
            return !img.alt || img.alt.trim() === '';
          }).length,
      );

      expect(imagesWithoutAlt).toBe(0);
    }, 30000);

    it('should be keyboard navigable', async () => {
      await open(path);

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() =>
        document.activeElement
          ? { tagName: document.activeElement.tagName, href: document.activeElement.href }
          : null,
      );

      expect(focusedElement).toBeTruthy();
      expect(focusedElement.tagName).toBe('A');
    }, 30000);
  });

  // Homepage-only: it is the only page carrying the contact form and the
  // Font Awesome social icon links.
  describe('homepage (/) — contact form and icon links', () => {
    it('should have proper form labels', async () => {
      await open('/');

      // Click contact link to open form
      await page.click('a[href="#contact"]');
      // page.waitForTimeout() was removed in puppeteer 22.
      await new Promise((resolve) => setTimeout(resolve, 500));

      const inputs = await page.$$eval(
        '#contact input[type="text"], #contact textarea',
        (elements) =>
          elements.map((el) => ({
            id: el.id,
            hasLabel: !!document.querySelector(`label[for="${el.id}"]`),
          })),
      );

      inputs.forEach((input) => {
        expect(input.hasLabel).toBe(true);
      });
    }, 30000);

    it('should have aria-labels on icon links', async () => {
      await open('/');

      const iconLinksWithoutAriaLabel = await page.$$eval(
        '.icon.brands',
        (links) => links.filter((link) => !link.getAttribute('aria-label')).length,
      );

      expect(iconLinksWithoutAriaLabel).toBe(0);
    }, 30000);
  });
});
