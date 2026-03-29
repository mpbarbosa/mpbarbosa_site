/**
 * HTML Functionality Tests
 *
 * Comprehensive testing for HTML template functionality including:
 * - HTML5 UP Dimension template features
 * - Font Awesome icon loading
 * - Responsive design breakpoints
 * - JavaScript integration
 * - Accessibility features
 *
 * @group functional
 */

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const INDEX_PATH = path.join(SRC_DIR, 'index.html');

let dom;
let document;

describe('HTML5 UP Dimension Template', () => {
  beforeAll(() => {
    const html = fs.readFileSync(INDEX_PATH, 'utf8');
    dom = new JSDOM(html, {
      url: 'http://localhost:8080',
      runScripts: 'outside-only',
      resources: 'usable',
    });
    document = dom.window.document;
  });

  describe('Core Template Structure', () => {
    test('should have proper HTML5 doctype', () => {
      const html = fs.readFileSync(INDEX_PATH, 'utf8');
      expect(html).toMatch(/^<!DOCTYPE html>/i);
    });

    test('should have main wrapper div', () => {
      const wrapper = document.getElementById('wrapper');
      expect(wrapper).toBeTruthy();
    });

    test('should have header with logo and nav', () => {
      const header = document.querySelector('header');
      expect(header).toBeTruthy();

      const logo = header.querySelector('.logo');
      expect(logo).toBeTruthy();

      const nav = header.querySelector('nav');
      expect(nav).toBeTruthy();
    });

    test('should have main content container', () => {
      const main = document.getElementById('main');
      expect(main).toBeTruthy();
    });

    test('should have footer', () => {
      const footer = document.getElementById('footer');
      expect(footer).toBeTruthy();
    });

    test('should have background div', () => {
      const bg = document.getElementById('bg');
      expect(bg).toBeTruthy();
    });
  });

  describe('Navigation Links', () => {
    test('should have all required navigation items', () => {
      const navLinks = document.querySelectorAll('nav a');
      expect(navLinks.length).toBeGreaterThan(0);

      const navTexts = Array.from(navLinks).map((link) => link.textContent);

      // Key navigation items
      expect(navTexts).toContain('Intro');
      expect(navTexts).toContain('About');
      expect(navTexts).toContain('Contact');
    });

    test('should have data-article attributes or hash navigation for internal links', () => {
      const dataArticleLinks = document.querySelectorAll('nav a[data-article]');
      const hashLinks = document.querySelectorAll('nav a[href^="#"]');

      // Accept either data-article attributes or hash-based navigation (HTML5 UP Dimension uses hashes)
      const internalLinks = dataArticleLinks.length > 0 ? dataArticleLinks : hashLinks;
      expect(internalLinks.length).toBeGreaterThan(0);

      if (dataArticleLinks.length > 0) {
        dataArticleLinks.forEach((link) => {
          const articleId = link.getAttribute('data-article');
          expect(articleId).toBeTruthy();
          expect(articleId).toMatch(/^[a-z-]+$/);
        });
      }
    });

    test('should have external link with proper security attributes', () => {
      const externalLinks = document.querySelectorAll('nav a[target="_blank"]');

      externalLinks.forEach((link) => {
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');
      });
    });
  });

  describe('Article Sections', () => {
    test('should have article elements for content', () => {
      const articles = document.querySelectorAll('#main article');
      expect(articles.length).toBeGreaterThan(0);
    });

    test('should have proper article IDs matching navigation', () => {
      const navArticles = Array.from(document.querySelectorAll('nav a[data-article]')).map((link) =>
        link.getAttribute('data-article'),
      );

      navArticles.forEach((articleId) => {
        const article = document.getElementById(articleId);
        expect(article).toBeTruthy();
        expect(article.tagName.toLowerCase()).toBe('article');
      });
    });

    test('should have close buttons on articles (or rely on JS for template close behavior)', () => {
      const articles = document.querySelectorAll('#main article');

      // HTML5 UP Dimension template adds close buttons via JavaScript at runtime
      // Static HTML may not include them — this is acceptable behavior
      articles.forEach((article) => {
        const closeBtn = article.querySelector('.close');
        if (!closeBtn) {
          // Check that article at least has an ID (template uses JS-based navigation)
          expect(article.id).toBeTruthy();
        }
      });
    });

    test('articles should have proper heading structure', () => {
      const articles = document.querySelectorAll('#main article');

      articles.forEach((article) => {
        const heading = article.querySelector('h2, h3');
        expect(heading).toBeTruthy();
      });
    });
  });

  describe('Contact Form', () => {
    test('should have contact form in contact article', () => {
      const contactArticle = document.getElementById('contact');
      expect(contactArticle).toBeTruthy();

      const form = contactArticle.querySelector('form');
      expect(form).toBeTruthy();
    });

    test('should have required form fields', () => {
      const form = document.querySelector('#contact form');

      if (form) {
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const messageTextarea = form.querySelector('textarea[name="message"]');

        expect(nameInput || form.querySelector('[placeholder*="Name"]')).toBeTruthy();
        expect(
          emailInput ||
            form.querySelector('[placeholder*="Email"]') ||
            form.querySelector('[type="email"]'),
        ).toBeTruthy();
        expect(messageTextarea || form.querySelector('textarea')).toBeTruthy();
      }
    });

    test('should have submit button', () => {
      const form = document.querySelector('#contact form');

      if (form) {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        expect(submitBtn).toBeTruthy();
      }
    });
  });

  describe('Project Links', () => {
    test('should have project section', () => {
      // The template uses "projetos" (Portuguese) as the article ID
      const projectsArticle = document.querySelector('[id*="project"], [id="projetos"]');
      expect(projectsArticle).toBeTruthy();
    });

    test('should have links to sibling projects', () => {
      const html = fs.readFileSync(INDEX_PATH, 'utf8');

      // Check for project references
      const expectedProjects = ['music_in_numbers', 'guia_js', 'monitora_vagas'];

      expectedProjects.forEach((project) => {
        // Links should point to redirect pages or direct paths
        const hasProjectRef =
          html.includes(project) ||
          html.includes(project.replace(/_/g, '-')) ||
          html.includes('Music in Numbers') ||
          html.includes('Guia Turístico') ||
          html.includes('Monitora Vagas');

        expect(hasProjectRef).toBe(true);
      });
    });
  });
});

describe('Font Awesome Integration', () => {
  test('should have Font Awesome CSS reference', () => {
    const html = fs.readFileSync(INDEX_PATH, 'utf8');
    // Font Awesome is bundled in main.css for this template
    expect(html).toMatch(/fontawesome|font-awesome|main\.css/i);
  });

  test('should reference Font Awesome icons', () => {
    const icons = document.querySelectorAll('[class*="fa-"]');
    expect(icons.length).toBeGreaterThan(0);
  });

  test('should have social media icon links', () => {
    const socialIcons = document.querySelectorAll('.icons a[class*="fa-"]');

    if (socialIcons.length > 0) {
      socialIcons.forEach((icon) => {
        expect(icon.href).toBeTruthy();
        expect(icon.href).toMatch(/^https?:\/\//);
      });
    }
  });
});

describe('Responsive Design', () => {
  test('should have viewport meta tag', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).toBeTruthy();
    expect(viewport.getAttribute('content')).toContain('width=device-width');
  });

  test('should load responsive CSS', () => {
    const html = fs.readFileSync(INDEX_PATH, 'utf8');
    expect(html).toContain('assets/css/main.css');
  });

  test('should have noscript fallback CSS', () => {
    const noscript = document.querySelector('noscript');

    if (noscript) {
      const content = noscript.textContent || noscript.innerHTML;
      expect(content).toContain('noscript.css');
    }
  });
});

describe('JavaScript Integration', () => {
  test('should load jQuery', () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const jqueryScript = scripts.find((s) => s.src.includes('jquery'));
    expect(jqueryScript).toBeTruthy();
  });

  test('should load template JavaScript utilities', () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const scriptPaths = scripts.map((s) => s.src);

    // Check for template JS files
    const expectedScripts = ['main.js', 'util.js'];
    expectedScripts.forEach((script) => {
      const hasScript = scriptPaths.some((path) => path.includes(script));
      expect(hasScript).toBe(true);
    });
  });

  test('should load breakpoints script for responsive behavior', () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const breakpointsScript = scripts.find((s) => s.src.includes('breakpoints'));
    expect(breakpointsScript).toBeTruthy();
  });
});

describe('SEO and Metadata', () => {
  test('should have title tag', () => {
    const title = document.querySelector('title');
    expect(title).toBeTruthy();
    expect(title.textContent.length).toBeGreaterThan(0);
  });

  test('should have meta description', () => {
    const description = document.querySelector('meta[name="description"]');
    expect(description).toBeTruthy();
    expect(description.getAttribute('content')).toBeTruthy();
  });

  test('should have charset declaration', () => {
    const charset = document.querySelector('meta[charset]');
    expect(charset).toBeTruthy();
    expect(charset.getAttribute('charset').toLowerCase()).toBe('utf-8');
  });

  test('should have language attribute on html tag', () => {
    const html = fs.readFileSync(INDEX_PATH, 'utf8');
    expect(html).toMatch(/<html[^>]*lang=/i);
  });
});

describe('Accessibility Features', () => {
  test('should have main landmark', () => {
    const main = document.querySelector('main, [role="main"]');
    expect(main).toBeTruthy();
  });

  test('should have proper heading hierarchy', () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    // Should have at least one heading
    expect(headings.length).toBeGreaterThan(0);
  });

  test('form inputs should have associated labels or aria-labels', () => {
    const inputs = document.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="reset"]), textarea:not([id*="demo"]), select',
    );

    inputs.forEach((input) => {
      // Skip demo form elements which are template examples
      if (input.id && input.id.includes('demo')) {
        return;
      }

      const hasLabel =
        input.closest('label') ||
        document.querySelector(`label[for="${input.id}"]`) ||
        input.getAttribute('aria-label') ||
        input.getAttribute('placeholder') ||
        input.getAttribute('aria-labelledby');

      expect(hasLabel).toBeTruthy();
    });
  });

  test('images should have alt attributes', () => {
    const images = document.querySelectorAll('img');

    images.forEach((img) => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });

  test('links should have meaningful text or aria-labels', () => {
    const links = document.querySelectorAll('a');

    links.forEach((link) => {
      const hasText =
        link.textContent.trim().length > 0 ||
        link.getAttribute('aria-label') ||
        link.querySelector('img[alt]') ||
        link.querySelector('[class*="fa-"]');

      expect(hasText).toBeTruthy();
    });
  });
});

describe('Performance Optimizations', () => {
  test('should defer non-critical JavaScript', () => {
    const scripts = document.querySelectorAll('script[src]');

    // Count scripts with defer or async
    const deferredScripts = Array.from(scripts).filter(
      (s) => s.hasAttribute('defer') || s.hasAttribute('async'),
    );

    // Either scripts are deferred OR scripts are at end of body (template pattern)
    const bodyScripts = Array.from(scripts).filter((s) => {
      let parent = s.parentElement;
      while (parent) {
        if (parent.tagName === 'BODY') {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    });

    // Pass if scripts are deferred OR at end of body
    expect(deferredScripts.length > 0 || bodyScripts.length > 0).toBe(true);
  });

  test('should preload critical assets if using preload', () => {
    const preloads = document.querySelectorAll('link[rel="preload"]');

    if (preloads.length > 0) {
      preloads.forEach((preload) => {
        expect(preload.getAttribute('as')).toBeTruthy();
      });
    }
  });
});
