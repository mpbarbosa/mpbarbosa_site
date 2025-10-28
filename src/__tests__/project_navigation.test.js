/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Helper function to get project root directory
const getProjectRoot = () => {
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

    test('should have all three project links in landing page', () => {
      if (!indexHTML) {
        console.warn('index.html not found, skipping test');
        return;
      }

      // Check that all project links exist
      const musicLink = document.querySelector('a[href*="music_in_numbers"]');
      const guiaLink = document.querySelector('a[href*="guia_turistico"]');
      const monitoraLink = document.querySelector('a[href*="monitora_vagas"]');

      expect(musicLink).toBeTruthy();
      expect(guiaLink).toBeTruthy();
      expect(monitoraLink).toBeTruthy();
    });

    test('should use consistent Material Design styling for project links', () => {
      if (!indexHTML) {
        return;
      }

      const projectLinks = document.querySelectorAll('a[href*="pages/"]');
      
      projectLinks.forEach(link => {
        // Should have Material Design button classes or similar styling
        const hasCardStyling = link.closest('.mdc-card') || 
                              link.classList.contains('mdc-button') ||
                              link.closest('.project-card');
        
        expect(hasCardStyling).toBeTruthy();
      });
    });

    test('should have descriptive link text for accessibility', () => {
      if (!indexHTML) {
        return;
      }

      const musicLink = document.querySelector('a[href*="music_in_numbers"]');
      const guiaLink = document.querySelector('a[href*="guia_turistico"]');
      const monitoraLink = document.querySelector('a[href*="monitora_vagas"]');

      if (musicLink) {
        expect(musicLink.textContent.trim().length).toBeGreaterThan(5);
        expect(musicLink.textContent.toLowerCase()).toMatch(/music|numbers|spotify|analytics/);
      }

      if (guiaLink) {
        expect(guiaLink.textContent.trim().length).toBeGreaterThan(5);
        expect(guiaLink.textContent.toLowerCase()).toMatch(/guia|tur|guide|travel/);
      }

      if (monitoraLink) {
        expect(monitoraLink.textContent.trim().length).toBeGreaterThan(5);
        expect(monitoraLink.textContent.toLowerCase()).toMatch(/monitora|vagas|job|monitor/);
      }
    });
  });

  describe('Project Redirect Pages Structure', () => {
    const redirectPages = [
      { file: 'music_in_numbers.html', project: 'music_in_numbers' },
      { file: 'guia_turistico.html', project: 'guia_turistico' },
      { file: 'monitora_vagas.html', project: 'monitora_vagas' }
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

        test('should have meta refresh redirect to submodule', () => {
          if (!pageContent) {
            return;
          }

          const metaRefreshMatch = pageContent.match(/<meta[^>]*http-equiv="refresh"[^>]*>/i);
          expect(metaRefreshMatch).toBeTruthy();

          if (metaRefreshMatch) {
            const refreshContent = metaRefreshMatch[0];
            expect(refreshContent).toContain(`../submodules/${project}/src`);
          }
        });

        test('should have project-specific redirect URL', () => {
          if (!pageContent) {
            return;
          }

          // Should redirect to the correct submodule
          expect(pageContent).toContain(`../submodules/${project}/src`);
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

      const projectSection = document.querySelector('#projects, [aria-label*="project"], .projects-section');
      
      if (projectSection) {
        // Should have proper heading structure
        const headings = projectSection.querySelectorAll('h1, h2, h3, h4, h5, h6');
        expect(headings.length).toBeGreaterThan(0);

        // Links should have descriptive text or aria-label
        const projectLinks = projectSection.querySelectorAll('a[href*="pages/"]');
        projectLinks.forEach(link => {
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
      
      projectLinks.forEach(link => {
        // Links should be focusable by default
        expect(link.tabIndex >= 0 || !link.hasAttribute('tabindex')).toBeTruthy();
        
        // Should not have disabled or hidden states that break keyboard navigation
        expect(link.style.display).not.toBe('none');
        expect(link.style.visibility).not.toBe('hidden');
        expect(link.hasAttribute('disabled')).toBe(false);
      });
    });
  });

  describe('Project Integration with Submodules', () => {
    test('should have .gitmodules configuration for all projects', () => {
      const gitmodulesPath = path.join(projectRoot, '.gitmodules');
      
      if (!fs.existsSync(gitmodulesPath)) {
        console.warn('.gitmodules not found, skipping test');
        return;
      }

      const gitmodulesContent = fs.readFileSync(gitmodulesPath, 'utf8');
      
      // Should include all three submodules
      expect(gitmodulesContent).toContain('music_in_numbers');
      expect(gitmodulesContent).toContain('guia_turistico');
      expect(gitmodulesContent).toContain('monitora_vagas');
    });

    test('should have consistent submodule directory structure', () => {
      const submodulesDir = path.join(srcDir, 'submodules');
      
      if (!fs.existsSync(submodulesDir)) {
        console.warn('submodules directory not found, skipping test');
        return;
      }

      const expectedSubmodules = ['music_in_numbers', 'guia_turistico', 'monitora_vagas'];
      
      expectedSubmodules.forEach(submodule => {
        const submodulePath = path.join(submodulesDir, submodule);
        
        // Directory should exist (may be empty if not initialized)
        expect(fs.existsSync(submodulePath)).toBe(true);
        
        if (fs.existsSync(submodulePath) && fs.statSync(submodulePath).isDirectory()) {
          // If submodule is initialized, should have src directory
          const srcPath = path.join(submodulePath, 'src');
          if (fs.existsSync(srcPath)) {
            expect(fs.statSync(srcPath).isDirectory()).toBe(true);
          }
        }
      });
    });
  });

  describe('Performance and Loading Considerations', () => {
    test('should have minimal but functional redirect pages', () => {
      const redirectPages = ['music_in_numbers.html', 'guia_turistico.html', 'monitora_vagas.html'];
      
      redirectPages.forEach(page => {
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
      const redirectPages = ['music_in_numbers.html', 'guia_turistico.html', 'monitora_vagas.html'];
      
      redirectPages.forEach(page => {
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