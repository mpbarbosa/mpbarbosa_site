/**
 * @jest-environment node
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

describe('Documentation Files Validation', () => {
  const projectRoot = getProjectRoot();
  const docsDir = path.join(projectRoot, 'docs');

  describe('Required Documentation Files', () => {
    test('should have docs directory', () => {
      expect(fs.existsSync(docsDir)).toBe(true);
      expect(fs.statSync(docsDir).isDirectory()).toBe(true);
    });

    test('should contain deployment documentation files', () => {
      const requiredDocs = ['README.md', 'ROADMAP.md'];

      requiredDocs.forEach((doc) => {
        const docPath = path.join(docsDir, doc);
        expect(fs.existsSync(docPath)).toBe(true);

        // Should be substantial documentation (not empty)
        const content = fs.readFileSync(docPath, 'utf8');
        expect(content.length).toBeGreaterThan(100);
      });
    });

    test('should have comprehensive README index', () => {
      const readmePath = path.join(docsDir, 'README.md');
      expect(fs.existsSync(readmePath)).toBe(true);

      const content = fs.readFileSync(readmePath, 'utf8');

      // Should have main heading and some structure
      expect(content).toMatch(/^# /m);
      expect(content.length).toBeGreaterThan(100);
    });
  });

  describe('Sync Documentation Content Quality', () => {
    test('functional documentation should have proper structure', () => {
      const funcDocPath = path.join(docsDir, 'SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md');

      if (!fs.existsSync(funcDocPath)) {
        return;
      }

      const content = fs.readFileSync(funcDocPath, 'utf8');

      // Should have proper Markdown structure
      expect(content).toMatch(/^# /m); // Should have main heading
      expect(content).toMatch(/## /m); // Should have subheadings

      // Should contain functional information
      expect(content.toLowerCase()).toMatch(/usage|purpose|workflow|process/);
    });

    test('technical documentation should have implementation details', () => {
      const techDocPath = path.join(docsDir, 'SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md');

      if (!fs.existsSync(techDocPath)) {
        return;
      }

      const content = fs.readFileSync(techDocPath, 'utf8');

      // Should have proper Markdown structure
      expect(content).toMatch(/^# /m); // Should have main heading
      expect(content).toMatch(/## /m); // Should have subheadings

      // Should contain technical information
      expect(content.toLowerCase()).toMatch(/implementation|architecture|function|code/);
    });
  });

  describe('Documentation Cross-References', () => {
    test('main README should reference sync script', () => {
      const mainReadmePath = path.join(projectRoot, 'README.md');

      if (!fs.existsSync(mainReadmePath)) {
        return;
      }

      const content = fs.readFileSync(mainReadmePath, 'utf8');

      // Should reference sync_to_staging.sh in structure and usage sections
      expect(content).toContain('sync_to_staging.sh');
    });

    test('shell scripts README should document sync script', () => {
      const shellReadmePath = path.join(projectRoot, 'shell_scripts', 'README.md');

      if (!fs.existsSync(shellReadmePath)) {
        return;
      }

      const content = fs.readFileSync(shellReadmePath, 'utf8');

      // Should document the sync script
      expect(content).toContain('sync_to_staging.sh');
      expect(content).toMatch(/### .*sync_to_staging\.sh/i);
    });

    test('copilot instructions should reference sync script', () => {
      const copilotPath = path.join(projectRoot, '.github', 'copilot-instructions.md');

      if (!fs.existsSync(copilotPath)) {
        return;
      }

      const content = fs.readFileSync(copilotPath, 'utf8');

      // Should reference sync script in deployment section
      expect(content).toContain('sync_to_staging.sh');
    });
  });

  describe('Project Structure Documentation Accuracy', () => {
    test('README should accurately reflect actual directory structure', () => {
      const mainReadmePath = path.join(projectRoot, 'README.md');

      if (!fs.existsSync(mainReadmePath)) {
        return;
      }

      const content = fs.readFileSync(mainReadmePath, 'utf8');

      // Check that documented directories actually exist
      const documentedDirs = ['shell_scripts/', 'src/', 'docs/', 'prompts/', 'public/', '.github/'];

      documentedDirs.forEach((dir) => {
        const dirPath = path.join(projectRoot, dir.replace('/', ''));
        if (content.includes(dir)) {
          expect(fs.existsSync(dirPath)).toBe(true);
        }
      });
    });

    test('should document required shell scripts', () => {
      const mainReadmePath = path.join(projectRoot, 'README.md');

      if (!fs.existsSync(mainReadmePath)) {
        return;
      }

      const content = fs.readFileSync(mainReadmePath, 'utf8');

      // Check that documented scripts actually exist
      const scriptNames = ['deploy_to_webserver.sh', 'sync_to_staging.sh'];

      scriptNames.forEach((script) => {
        if (content.includes(script)) {
          const scriptPath = path.join(projectRoot, 'shell_scripts', script);
          expect(fs.existsSync(scriptPath)).toBe(true);
        }
      });
    });
  });
});
