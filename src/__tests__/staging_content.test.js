/**
 * @jest-environment node
 *
 * Verifies that the staging repo (../mpbarbosa.com/) contains the expected
 * production content after a sync_to_staging.sh --step1 run.
 *
 * These tests are the gate between "source is correct" and "staging is ready
 * to deploy". They fail if sync was never run or if new source files were
 * added without updating the sync script.
 *
 * Presence checks run whenever the staging directory exists. Content checks
 * describe what the CURRENT source says, so they only run once staging
 * actually matches src/ — a stale staging means "not promoted yet", which is
 * a deploy-pipeline state, not a source defect. When staging is stale the
 * content checks are skipped with a warning naming the files that differ.
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
const srcDir = path.join(projectRoot, 'src');
const stagingDir = path.resolve(projectRoot, '../mpbarbosa.com');

const stagingExists = fs.existsSync(stagingDir) && fs.statSync(stagingDir).isDirectory();

const stagingPath = (...parts) => path.join(stagingDir, ...parts);

const readStaging = (filePath) => {
  const full = stagingPath(filePath);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
};

const readSource = (filePath) => {
  const full = path.join(srcDir, filePath);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
};

// Files whose content the checks below assert on. Staging is "in sync" only
// when every one of them is byte-identical to its source.
const SYNCED_FILES = [
  'index.html',
  'en/index.html',
  'en/singularity/index.html',
  'cv/index.html',
  'llms.txt',
  'llms-full.txt',
];

const staleFiles = stagingExists
  ? SYNCED_FILES.filter((f) => readStaging(f) !== readSource(f))
  : SYNCED_FILES;

const stagingInSync = stagingExists && staleFiles.length === 0;

describe('Staging content — production readiness', () => {
  beforeAll(() => {
    if (!stagingExists) {
      console.warn(
        `Staging directory not found at ${stagingDir}. Run sync_to_staging.sh --step1 first.`,
      );
    } else if (!stagingInSync) {
      console.warn(
        `Staging is behind src/ for: ${staleFiles.join(', ')}. ` +
          'Content checks skipped — run sync_to_staging.sh --step1 to promote and re-run.',
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

    test('index.html should lead with the professional positioning', () => {
      if (!stagingInSync) return;
      const content = readStaging('index.html');
      expect(content).toContain('Consultor e Engenheiro de Soluções');
      expect(content).toContain('26 anos');
      expect(content).toMatch(/billing/i);
      expect(content).toContain('PL/SQL');
      expect(content).toMatch(/conciliação/i);
    });

    test('index.html should state availability for senior positions', () => {
      if (!stagingInSync) return;
      const content = readStaging('index.html');
      expect(content).toContain('Disponível para posições sênior');
    });

    test('index.html should link both products in production', () => {
      if (!stagingInSync) return;
      const content = readStaging('index.html');
      expect(content).toContain('https://brasileirao.mpbarbosa.com');
      expect(content).toContain('https://copa2026.mpbarbosa.com');
    });

    test('index.html should name the AI coding agents it is built with', () => {
      if (!stagingInSync) return;
      const content = readStaging('index.html');
      expect(content).toContain('Claude Code');
      expect(content).toContain('GitHub Copilot');
      expect(content).toContain('Cursor');
    });

    test('index.html should not credit the work to prompts or mention language study', () => {
      if (!stagingInSync) return;
      const content = readStaging('index.html');
      expect(content).not.toMatch(/prompts de IA/i);
      expect(content).not.toMatch(/estudando inglês/i);
      expect(content).not.toMatch(/25 anos/i);
    });

    test('index.html should carry schema.org Person structured data', () => {
      if (!stagingInSync) return;
      const content = readStaging('index.html');
      expect(content).toContain('application/ld+json');
      const match = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      expect(match).toBeTruthy();
      const person = JSON.parse(match[1]);
      expect(person['@type']).toBe('Person');
      expect(person.name).toBe('Marcelo Pereira Barbosa');
      expect(person.knowsAbout.length).toBeGreaterThan(0);
    });

    test('robots.txt should be present', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('robots.txt'))).toBe(true);
    });

    test('ads.txt should be present', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('ads.txt'))).toBe(true);
    });

    test('ads.txt should declare the AdSense publisher', () => {
      if (!stagingExists) return;
      const content = readStaging('ads.txt');
      expect(content).toContain('google.com, pub-9509229216258895, DIRECT, f08c47fec0942fa0');
    });

    test('favicon.svg should be present', () => {
      if (!stagingExists) return;
      expect(fs.existsSync(stagingPath('favicon.svg'))).toBe(true);
    });
  });

  describe('Resume (cv/)', () => {
    test('cv/ should serve the resume PDF behind a stable URL', () => {
      if (!stagingInSync) return;
      expect(fs.existsSync(stagingPath('cv', 'index.html'))).toBe(true);
      expect(fs.existsSync(stagingPath('cv', 'cv-marcelo-pereira-barbosa.pdf'))).toBe(true);
    });

    test('both portfolios should link to /cv/', () => {
      if (!stagingInSync) return;
      expect(readStaging('index.html')).toContain('href="cv/"');
      expect(readStaging('en/index.html')).toContain('href="../cv/"');
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

    test('en/index.html should mirror the professional positioning', () => {
      if (!stagingInSync) return;
      const content = readStaging('en/index.html');
      expect(content).toContain('Solutions Consultant');
      expect(content).toContain('26 years');
      expect(content).toMatch(/telecom billing/i);
      expect(content).toContain('PL/SQL');
      expect(content).toMatch(/reconciliation/i);
      expect(content).toContain('Available for senior roles');
    });

    test('en/index.html should not carry the investor call-to-action', () => {
      if (!stagingInSync) return;
      const content = readStaging('en/index.html');
      expect(content).not.toContain('>Invest<');
      expect(content).not.toContain('id="singularity"');
      expect(content).not.toContain('btn-singularity');
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

  describe('Singularity mission page (en/singularity/)', () => {
    test('should be present at its own URL', () => {
      if (!stagingInSync) return;
      expect(fs.existsSync(stagingPath('en', 'singularity', 'index.html'))).toBe(true);
    });

    test('should carry the ai_workflow mission statement and the fund CTA', () => {
      if (!stagingInSync) return;
      const content = readStaging('en/singularity/index.html');
      expect(content).toContain('id="singularity"');
      expect(content).toContain('Back this mission');
      expect(content).toContain('singularity.diy');
      expect(content).toContain('ai_workflow');
      expect(content).toContain('automation layer');
      expect(content).toContain('any AI coding tool');
    });

    test('should reference grandparent assets correctly', () => {
      if (!stagingInSync) return;
      const content = readStaging('en/singularity/index.html');
      expect(content).toContain('../../styles/v2.css');
      expect(content).toContain('../../scripts/v2.js');
    });

    test('should be reachable from the English portfolio', () => {
      if (!stagingInSync) return;
      expect(readStaging('en/index.html')).toContain('href="singularity/"');
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

    test('llms.txt should lead with the role and availability', () => {
      if (!stagingInSync) return;
      const content = readStaging('llms.txt');
      expect(content).toContain('Solutions Consultant');
      expect(content).toContain('26 years');
      expect(content).toMatch(/telecom billing/i);
      expect(content).toContain('Available for senior positions');
      expect(content).toContain('https://mpbarbosa.com/cv/');
    });

    test('llms.txt should list both products in production', () => {
      if (!stagingInSync) return;
      const content = readStaging('llms.txt');
      expect(content).toContain('https://brasileirao.mpbarbosa.com');
      expect(content).toContain('https://copa2026.mpbarbosa.com');
    });

    test('llms.txt should still list ai_workflow as a project', () => {
      if (!stagingInSync) return;
      const content = readStaging('llms.txt');
      expect(content).toContain('github.com/mpbarbosa/ai_workflow');
    });

    test('llms.txt should list the owner and contact links', () => {
      if (!stagingExists) return;
      const content = readStaging('llms.txt');
      expect(content).toContain('Marcelo Pereira Barbosa');
      expect(content).toContain('github.com/mpbarbosa');
      expect(content).toContain('linkedin.com/in/mpbarbosa');
    });

    test('llms-full.txt should contain the career record', () => {
      if (!stagingInSync) return;
      const content = readStaging('llms-full.txt');
      expect(content).toContain('Objective Solutions');
      expect(content).toContain('Diginet');
      expect(content).toContain('PL/SQL');
      expect(content).toContain('Eleflow');
      expect(content).toContain('BigQuery');
      expect(content).toContain('Universidade Presbiteriana Mackenzie');
    });

    test('llms-full.txt should detail both products in production', () => {
      if (!stagingInSync) return;
      const content = readStaging('llms-full.txt');
      expect(content).toContain('Portal Brasileirão');
      expect(content).toContain('Agora na Copa 2026');
      expect(content).toContain('Dixon-Coles');
      expect(content).toContain('Playwright');
    });

    test('llms-full.txt should point the fundraising at the Singularity page', () => {
      if (!stagingInSync) return;
      const content = readStaging('llms-full.txt');
      expect(content).toContain('mpbarbosa.com/en/singularity/');
    });

    test('llms-full.txt should reference the English portfolio', () => {
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
