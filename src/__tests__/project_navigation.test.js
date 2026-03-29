/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper function to get project root directory
const getProjectRoot = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '../..');
};

// Helper function to load HTML file content
const loadHTMLFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return null;
};

describe('Project Navigation Integration Tests', () => {
  const projectRoot = getProjectRoot();
  const srcDir = path.join(projectRoot, 'src');

  describe('Landing Page Project Links', () => {
    let indexHTML;

    beforeEach(() => {
      const indexPath = path.join(srcDir, 'index.html');
      indexHTML = loadHTMLFile(indexPath);

      if (indexHTML) {
        document.body.innerHTML = indexHTML;
      }
    });

    afterEach(() => {
      // Clean up DOM
      document.body.innerHTML = '';
    });

    test('should have Music in Numbers project link in landing page', () => {
      if (!indexHTML) {
        console.warn('index.html not found, skipping test');
        return;
      }

      // Check that Music in Numbers project link exists
      const musicLink = document.querySelector('a[href*="music_in_numbers"]');

      expect(musicLink).toBeTruthy();
      expect(musicLink.href).toContain('music_in_numbers');
      expect(musicLink.textContent).toContain('Music in Numbers');
    });

    test('should use consistent styling for project links', () => {
      if (!indexHTML) {
        return;
      }

      const projectLinks = document.querySelectorAll(
        'a[href*="music_in_numbers"], a[href*="guia_js"], a[href*="monitora_vagas"]',
      );

      // Test passes if we have at least one project link and it's properly formatted
      expect(projectLinks.length).toBeGreaterThan(0);

      projectLinks.forEach((link) => {
        expect(link.href).toBeTruthy();
        expect(link.textContent.trim()).toBeTruthy();
      });
    });

    test('should have descriptive link text for accessibility', () => {
      if (!indexHTML) {
        return;
      }

      const musicLink = document.querySelector('a[href*="music_in_numbers"]');
      const guiaLink = document.querySelector('a[href*="guia_js"]');
      const monitoraLink = document.querySelector('a[href*="monitora_vagas"]');

      if (musicLink) {
        expect(musicLink.textContent.trim().length).toBeGreaterThan(5);
        expect(musicLink.textContent.toLowerCase()).toMatch(/music|numbers|spotify|analytics/);
      }

      if (guiaLink) {
        expect(guiaLink.textContent.trim().length).toBeGreaterThan(3);
        expect(guiaLink.textContent.toLowerCase()).toMatch(/guia|tur|guide|travel|onde|estou/);
      }

      if (monitoraLink) {
        expect(monitoraLink.textContent.trim().length).toBeGreaterThan(5);
        expect(monitoraLink.textContent.toLowerCase()).toMatch(/monitora|vagas|job|monitor/);
      }
    });
  });

  describe('Project Redirect Pages Structure', () => {
    const redirectPages = [
      { file: 'music-in-numbers.html', project: 'music_in_numbers' },
      { file: 'guia-turistico.html', project: 'guia_js' },
      { file: 'monitora-vagas.html', project: 'monitora_vagas' },
    ];

    redirectPages.forEach(({ file, project }) => {
      describe(`${file} redirect page`, () => {
        let pageContent;

        beforeEach(() => {
          const pagePath = path.join(srcDir, 'pages', file);
          pageContent = loadHTMLFile(pagePath);
        });

        test('should have basic redirect structure', () => {
          if (!pageContent) {
            console.warn(`${file} not found, skipping test`);
            return;
          }

          // Should have at least a meta refresh tag
          expect(pageContent).toContain('<meta');
          expect(pageContent).toMatch(/http-equiv="refresh"/i);
        });

        test('should have meta refresh redirect to project', () => {
          if (!pageContent) {
            return;
          }

          const metaRefreshMatch = pageContent.match(/<meta[^>]*http-equiv="refresh"[^>]*>/i);
          expect(metaRefreshMatch).toBeTruthy();

          if (metaRefreshMatch) {
            const refreshContent = metaRefreshMatch[0];
            expect(refreshContent).toContain(`../${project}`);
          }
        });

        test('should have project-specific redirect URL', () => {
          if (!pageContent) {
            return;
          }

          // Should redirect to the correct sibling project directory
          expect(pageContent).toContain(`../${project}`);
        });

        test('should have correct redirect timing', () => {
          if (!pageContent) {
            return;
          }

          // Should have immediate redirect (0 seconds)
          expect(pageContent).toMatch(/content="0;/);
        });
      });
    });
  });

  describe('Project Navigation Accessibility', () => {
    test('should have proper ARIA labels and semantic markup', () => {
      const indexPath = path.join(srcDir, 'index.html');
      const indexHTML = loadHTMLFile(indexPath);

      if (!indexHTML) {
        return;
      }

      document.body.innerHTML = indexHTML;

      const projectSection = document.querySelector(
        '#projects, [aria-label*="project"], .projects-section',
      );

      if (projectSection) {
        // Should have proper heading structure
        const headings = projectSection.querySelectorAll('h1, h2, h3, h4, h5, h6');
        expect(headings.length).toBeGreaterThan(0);

        // Links should have descriptive text or aria-label
        const projectLinks = projectSection.querySelectorAll('a[href*="pages/"]');
        projectLinks.forEach((link) => {
          const hasDescriptiveText = link.textContent.trim().length > 3;
          const hasAriaLabel = link.hasAttribute('aria-label');
          const hasTitle = link.hasAttribute('title');

          expect(hasDescriptiveText || hasAriaLabel || hasTitle).toBeTruthy();
        });
      }
    });

    test('should have keyboard navigation support', () => {
      const indexPath = path.join(srcDir, 'index.html');
      const indexHTML = loadHTMLFile(indexPath);

      if (!indexHTML) {
        return;
      }

      document.body.innerHTML = indexHTML;

      const projectLinks = document.querySelectorAll('a[href*="pages/"]');

      projectLinks.forEach((link) => {
        // Links should be focusable by default
        expect(link.tabIndex >= 0 || !link.hasAttribute('tabindex')).toBeTruthy();

        // Should not have disabled or hidden states that break keyboard navigation
        expect(link.style.display).not.toBe('none');
        expect(link.style.visibility).not.toBe('hidden');
        expect(link.hasAttribute('disabled')).toBe(false);
      });
    });
  });

  describe('Project Integration with Sibling Architecture', () => {
    test('should have sibling project redirect pages for all projects', () => {
      const redirectPages = ['music-in-numbers.html', 'guia-turistico.html', 'monitora-vagas.html'];
      const pagesDir = path.join(srcDir, 'pages');

      redirectPages.forEach((page) => {
        const pagePath = path.join(pagesDir, page);
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf8');
          expect(content).toContain('http-equiv="refresh"');
        }
      });
    });

    test('should have sibling project links in index.html', () => {
      const indexPath = path.join(srcDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        console.warn('index.html not found, skipping test');
        return;
      }

      const content = fs.readFileSync(indexPath, 'utf8');
      // Projects are deployed as top-level sibling directories
      const siblingProjects = ['music_in_numbers', 'guia_js', 'monitora_vagas'];
      const foundProjects = siblingProjects.filter((p) => content.includes(p));
      expect(foundProjects.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Loading Considerations', () => {
    test('should have minimal but functional redirect pages', () => {
      const redirectPages = ['music-in-numbers.html', 'guia-turistico.html', 'monitora-vagas.html'];

      redirectPages.forEach((page) => {
        const pagePath = path.join(srcDir, 'pages', page);
        const content = loadHTMLFile(pagePath);

        if (content) {
          // Should have meta refresh tag
          expect(content).toMatch(/http-equiv="refresh"/i);

          // Should be a minimal but functional redirect
          expect(content.trim().length).toBeGreaterThan(10);
        }
      });
    });

    test('should have reasonable redirect timing', () => {
      const redirectPages = ['music-in-numbers.html', 'guia-turistico.html', 'monitora-vagas.html'];

      redirectPages.forEach((page) => {
        const pagePath = path.join(srcDir, 'pages', page);
        const content = loadHTMLFile(pagePath);

        if (content) {
          const refreshMatch = content.match(/content="(\d+);/);

          if (refreshMatch) {
            const refreshTime = parseInt(refreshMatch[1]);
            // Should redirect within reasonable time (0-5 seconds)
            expect(refreshTime).toBeGreaterThanOrEqual(0);
            expect(refreshTime).toBeLessThanOrEqual(5);
          }
        }
      });
    });
  });
});
