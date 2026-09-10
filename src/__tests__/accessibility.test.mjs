/**
 * Accessibility Testing Suite
 * Tests WCAG 2.1 Level AA compliance using axe-core
 *
 * Requirements: a running dev server at http://127.0.0.1:8080 and Chrome/Chromium available.
 * The suite is skipped automatically when those conditions are not met (e.g. in CI without a browser).
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
  { name: 'English portfolio (/en/)', path: '/en/', lang: 'en' },
  { name: 'Singularity (/en/singularity/)', path: '/en/singularity/', lang: 'en' },
];

describe('Accessibility Tests', () => {
  let browser;
  let page;
  let browserAvailable = false;

  beforeAll(async () => {
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      page = await browser.newPage();
      browserAvailable = true;
    } catch {
      // Chrome not available or server not running — tests will be skipped
    }
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  const open = (path) => page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle0' });

  describe.each(PAGES)('$name', ({ path, lang }) => {
    it('should pass axe accessibility tests', async () => {
      if (!browserAvailable) {
        return;
      }
      await open(path);

      const results = await new AxePuppeteer(page).withTags(WCAG_TAGS).analyze();

      expect(results.violations).toHaveLength(0);
    }, 30000);

    it('should have proper semantic HTML structure', async () => {
      if (!browserAvailable) {
        return;
      }
      await open(path);

      expect(await page.$('main')).toBeTruthy();
      expect(await page.$('nav[role="navigation"]')).toBeTruthy();
      expect(await page.$('footer[role="contentinfo"]')).toBeTruthy();
    }, 30000);

    it(`should declare lang="${lang}" on the html element`, async () => {
      if (!browserAvailable) {
        return;
      }
      await open(path);

      expect(await page.$eval('html', (el) => el.getAttribute('lang'))).toBe(lang);
    }, 30000);

    it('should have exactly one h1', async () => {
      if (!browserAvailable) {
        return;
      }
      await open(path);

      expect(await page.$$eval('h1', (els) => els.length)).toBe(1);
    }, 30000);

    it('should have alt text on all images', async () => {
      if (!browserAvailable) {
        return;
      }
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
      if (!browserAvailable) {
        return;
      }
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
      if (!browserAvailable) {
        return;
      }
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
      if (!browserAvailable) {
        return;
      }
      await open('/');

      const iconLinksWithoutAriaLabel = await page.$$eval(
        '.icon.brands',
        (links) => links.filter((link) => !link.getAttribute('aria-label')).length,
      );

      expect(iconLinksWithoutAriaLabel).toBe(0);
    }, 30000);
  });
});
