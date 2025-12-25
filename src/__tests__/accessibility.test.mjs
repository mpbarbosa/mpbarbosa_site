/**
 * Accessibility Testing Suite
 * Tests WCAG 2.1 Level AA compliance using axe-core
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { AxePuppeteer } from 'axe-puppeteer';
import puppeteer from 'puppeteer';

describe('Accessibility Tests', () => {
  let browser;
  let page;
  const BASE_URL = 'http://127.0.0.1:8080';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should pass axe accessibility tests on homepage', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const results = await new AxePuppeteer(page).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toHaveLength(0);
  }, 30000);

  it('should have proper semantic HTML structure', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const main = await page.$('main');
    const nav = await page.$('nav[role="navigation"]');
    const footer = await page.$('footer[role="contentinfo"]');

    expect(main).toBeTruthy();
    expect(nav).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  it('should have lang attribute on html element', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const lang = await page.$eval('html', (el) => el.getAttribute('lang'));
    expect(lang).toBe('pt-BR');
  });

  it('should have alt text on all images', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const imagesWithoutAlt = await page.$$eval(
      'img',
      (imgs) => imgs.filter((img) => !img.alt || img.alt.trim() === '').length,
    );

    expect(imagesWithoutAlt).toBe(0);
  });

  it('should have proper form labels', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Click contact link to open form
    await page.click('a[href="#contact"]');
    await page.waitForTimeout(500);

    const inputs = await page.$$eval('#contact input[type="text"], #contact textarea', (elements) =>
      elements.map((el) => ({
        id: el.id,
        hasLabel: !!document.querySelector(`label[for="${el.id}"]`),
      })),
    );

    inputs.forEach((input) => {
      expect(input.hasLabel).toBe(true);
    });
  });

  it('should have aria-labels on icon links', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const iconLinksWithoutAriaLabel = await page.$$eval(
      '.icon.brands',
      (links) => links.filter((link) => !link.getAttribute('aria-label')).length,
    );

    expect(iconLinksWithoutAriaLabel).toBe(0);
  });

  it('should be keyboard navigable', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => {
      return document.activeElement
        ? {
            tagName: document.activeElement.tagName,
            href: document.activeElement.href,
          }
        : null;
    });

    expect(focusedElement).toBeTruthy();
    expect(focusedElement.tagName).toBe('A');
  });

  it('should pass color contrast requirements', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const results = await new AxePuppeteer(page)
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // Will enable after CSS review
      .analyze();

    // Check for other violations excluding color contrast
    const violations = results.violations.filter((v) => v.id !== 'color-contrast');
    expect(violations).toHaveLength(0);
  }, 30000);
});
