/**
 * @jest-environment node
 *
 * Verifies that the staging repo (../mpbarbosa.com/) contains the expected
 * production content after a sync_to_staging.sh --step1 run.
 *
 * These tests are the gate between "source is correct" and "staging is ready
 * to deploy". They fail if sync was never run or if new source files were
 * added without updating the sync script.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const getProjectRoot = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '../..');
};

const projectRoot = getProjectRoot();
const stagingDir = path.resolve(projectRoot, '../mpbarbosa.com');

const stagingExists = fs.existsSync(stagingDir) && fs.statSync(stagingDir).isDirectory();

const stagingPath = (...parts) => path.join(stagingDir, ...parts);

const readStaging = (filePath) => {
  const full = stagingPath(filePath);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
};

describe('Staging content — production readiness', () => {
  beforeAll(() => {
    if (!stagingExists) {
      console.warn(
        `Staging directory not found at ${stagingDir}. Run sync_to_staging.sh --step1 first.`,
      );
    }
  });

  describe('Staging directory', () => {
    test('should exist at ../mpbarbosa.com', () => {
      expect(stagingExists).toBe(true);
    });

    test('should be a git repository', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('.git'))).toBe(true);
    });
  });

  describe('Core files', () => {
    test('index.html should be present', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('index.html'))).toBe(true);
    });

    test('index.html should be Portuguese (pt-BR)', () => {
      if (!stagingExists) return;
      const content = readStaging('index.html');
      expect(content).toContain('lang="pt-BR"');
    });

    test('index.html should include the EN language toggle', () => {
      if (!stagingExists) return;
      const content = readStaging('index.html');
      expect(content).toContain('href="en/"');
      expect(content).toContain('EN');
    });

    test('index.html should mention AI coding tools by name', () => {
      if (!stagingExists) return;
      const content = readStaging('index.html');
      expect(content).toContain('GitHub Copilot');
      expect(content).toContain('Claude Code');
      expect(content).toContain('Cursor');
      expect(content).toContain('Google Stitch');
    });

    test('robots.txt should be present', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('robots.txt'))).toBe(true);
    });

    test('favicon.svg should be present', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('favicon.svg'))).toBe(true);
    });
  });

  describe('English portfolio (en/)', () => {
    test('en/index.html should be present', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('en', 'index.html'))).toBe(true);
    });

    test('en/index.html should be English (lang=en)', () => {
      if (!stagingExists) return;
      const content = readStaging('en/index.html');
      expect(content).toContain('lang="en"');
    });

    test('en/index.html should include PT language toggle back to root', () => {
      if (!stagingExists) return;
      const content = readStaging('en/index.html');
      expect(content).toContain('href="../"');
      expect(content).toContain('PT');
    });

    test('en/index.html should contain Singularity section', () => {
      if (!stagingExists) return;
      const content = readStaging('en/index.html');
      expect(content).toContain('id="singularity"');
      expect(content).toContain('Back this mission');
      expect(content).toContain('singularity.diy');
    });

    test('en/index.html should display ai_workflow mission statement', () => {
      if (!stagingExists) return;
      const content = readStaging('en/index.html');
      expect(content).toContain('ai_workflow');
      expect(content).toContain('automation layer');
      expect(content).toContain('any AI coding tool');
    });

    test('en/index.html should display key project metrics', () => {
      if (!stagingExists) return;
      const content = readStaging('en/index.html');
      expect(content).toContain('v4.3.0');
      expect(content).toContain('111');
      expect(content).toContain('100%');
    });

    test('en/index.html canonical URL should point to /en/', () => {
      if (!stagingExists) return;
      const content = readStaging('en/index.html');
      expect(content).toContain('https://mpbarbosa.com/en/');
    });

    test('en/index.html should reference parent assets correctly', () => {
      if (!stagingExists) return;
      const content = readStaging('en/index.html');
      expect(content).toContain('../styles/v2.css');
      expect(content).toContain('../scripts/v2.js');
      expect(content).toContain('../assets/css/fontawesome-all.min.css');
    });
  });

  describe('LLM-readable files', () => {
    test('llms.txt should be present at domain root', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('llms.txt'))).toBe(true);
    });

    test('llms-full.txt should be present at domain root', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('llms-full.txt'))).toBe(true);
    });

    test('llms.txt should contain the canonical mission statement', () => {
      if (!stagingExists) return;
      const content = readStaging('llms.txt');
      expect(content).toContain('ai_workflow');
      expect(content).toContain('AI-assisted development reliable');
      expect(content).toContain('singularity.diy');
    });

    test('llms.txt should list the owner and contact links', () => {
      if (!stagingExists) return;
      const content = readStaging('llms.txt');
      expect(content).toContain('Marcelo Pereira Barbosa');
      expect(content).toContain('github.com/mpbarbosa');
      expect(content).toContain('linkedin.com/in/mpbarbosa');
    });

    test('llms-full.txt should contain comprehensive project details', () => {
      if (!stagingExists) return;
      const content = readStaging('llms-full.txt');
      expect(content).toContain('111 total modules');
      expect(content).toContain('23-step');
      expect(content).toContain('100% test coverage');
      expect(content).toContain('Solana');
    });

    test('llms-full.txt should reference the English investor page', () => {
      if (!stagingExists) return;
      const content = readStaging('llms-full.txt');
      expect(content).toContain('mpbarbosa.com/en/');
    });
  });

  describe('Assets and styles', () => {
    test('styles/v2.css should be present', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('styles', 'v2.css'))).toBe(true);
    });

    test('scripts/v2.js should be present', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('scripts', 'v2.js'))).toBe(true);
    });

    test('assets/css directory should contain CSS files', () => {
      if (!stagingExists) return;
      const cssDir = stagingPath('assets', 'css');
      expect(fs.existsSync(cssDir)).toBe(true);
      const files = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css'));
      expect(files.length).toBeGreaterThan(0);
    });

    test('assets/webfonts directory should contain font files', () => {
      if (!stagingExists) return;
      const fontsDir = stagingPath('assets', 'webfonts');
      expect(fs.existsSync(fontsDir)).toBe(true);
      const fontExtensions = ['.woff', '.woff2', '.ttf', '.eot', '.otf', '.svg'];
      const files = fs
        .readdirSync(fontsDir)
        .filter((f) => fontExtensions.some((ext) => f.endsWith(ext)));
      expect(files.length).toBeGreaterThan(0);
    });

    test('images directory should contain image files', () => {
      if (!stagingExists) return;
      const imagesDir = stagingPath('images');
      expect(fs.existsSync(imagesDir)).toBe(true);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
      const files = fs
        .readdirSync(imagesDir)
        .filter((f) => imageExtensions.some((ext) => f.endsWith(ext)));
      expect(files.length).toBeGreaterThan(0);
    });
  });
});
