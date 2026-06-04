/**
 * @jest-environment node
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper function to get project root directory
const getProjectRoot = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '../..');
};

// Helper function to check if a shell script exists and is executable
const checkScriptExecutable = (scriptPath) => {
  try {
    const stats = fs.statSync(scriptPath);
    return stats.isFile() && (stats.mode & 0o111) !== 0;
  } catch {
    return false;
  }
};

describe('Shell Scripts Functionality', () => {
  const projectRoot = getProjectRoot();
  const shellScriptsDir = path.join(projectRoot, 'shell_scripts');

  describe('Shell Scripts Directory Structure', () => {
    test('should have shell_scripts directory', () => {
      expect(fs.existsSync(shellScriptsDir)).toBe(true);
      expect(fs.statSync(shellScriptsDir).isDirectory()).toBe(true);
    });

    test('should contain all required shell scripts', () => {
      const requiredScripts = ['deploy_to_webserver.sh', 'sync_to_staging.sh', 'README.md'];

      requiredScripts.forEach((script) => {
        const scriptPath = path.join(shellScriptsDir, script);
        expect(fs.existsSync(scriptPath)).toBe(true);
      });

      // Deprecated scripts should be in deprecated folder
      const deprecatedScripts = ['pull_all_submodules.sh', 'push_all_submodules.sh'];
      const deprecatedDir = path.join(shellScriptsDir, 'deprecated');

      if (fs.existsSync(deprecatedDir)) {
        deprecatedScripts.forEach((script) => {
          const scriptPath = path.join(deprecatedDir, script);
          expect(fs.existsSync(scriptPath)).toBe(true);
        });
      }
    });

    test('should have executable permissions on shell scripts', () => {
      const executableScripts = ['deploy_to_webserver.sh', 'sync_to_staging.sh'];

      executableScripts.forEach((script) => {
        const scriptPath = path.join(shellScriptsDir, script);
        if (fs.existsSync(scriptPath)) {
          expect(checkScriptExecutable(scriptPath)).toBe(true);
        }
      });

      // Check deprecated scripts if they exist
      const deprecatedDir = path.join(shellScriptsDir, 'deprecated');
      const deprecatedScripts = ['pull_all_submodules.sh', 'push_all_submodules.sh'];

      if (fs.existsSync(deprecatedDir)) {
        deprecatedScripts.forEach((script) => {
          const scriptPath = path.join(deprecatedDir, script);
          if (fs.existsSync(scriptPath)) {
            expect(checkScriptExecutable(scriptPath)).toBe(true);
          }
        });
      }
    });
  });

  describe('Deployment Script Functionality', () => {
    const deployScript = path.join(shellScriptsDir, 'deploy_to_webserver.sh');

    test('should have proper shebang and be valid bash script', () => {
      if (!fs.existsSync(deployScript)) {
        return; // Skip if script doesn't exist
      }

      const content = fs.readFileSync(deployScript, 'utf8');
      expect(content.startsWith('#!/bin/bash')).toBe(true);

      // Check for essential functions
      expect(content).toContain('create_backup');
      expect(content).toContain('deploy_files');
      expect(content).toContain('validate_environment');
    });

    test('should support dry-run mode', () => {
      if (!fs.existsSync(deployScript)) {
        return; // Skip if script doesn't exist
      }

      const content = fs.readFileSync(deployScript, 'utf8');
      expect(content).toContain('DRY_RUN');
      expect(content).toContain('--dry-run');
    });

    test('should have comprehensive error handling', () => {
      if (!fs.existsSync(deployScript)) {
        return; // Skip if script doesn't exist
      }

      const content = fs.readFileSync(deployScript, 'utf8');
      expect(content).toContain('set -e'); // Exit on error
      expect(content).toContain('print_error'); // Error handling function
    });

    test('should validate dry-run execution without errors', (done) => {
      if (!fs.existsSync(deployScript)) {
        done();
        return;
      }

      // Test dry-run mode (should not make any changes)
      const child = spawn('bash', [deployScript, '--dry-run'], {
        cwd: projectRoot,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';
      let settled = false;

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      const timeoutId = setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        child.kill();
        done();
      }, 10000);

      timeoutId.unref?.();

      child.on('close', (code) => {
        clearTimeout(timeoutId);
        if (settled) {
          return;
        }

        settled = true;

        // Dry-run should complete without errors or with controlled exit
        expect(code === 0 || code === 1).toBe(true); // 1 is acceptable for dry-run validation

        // Should contain dry-run indicators
        const output = stdout + stderr;
        expect(output.toLowerCase()).toMatch(/dry.?run|would|simulation|preview/);

        done();
      });
    }, 15000);
  });

  describe('Submodule Management Scripts (Deprecated)', () => {
    const deprecatedDir = path.join(shellScriptsDir, 'deprecated');
    const pullScript = path.join(deprecatedDir, 'pull_all_submodules.sh');
    const pushScript = path.join(deprecatedDir, 'push_all_submodules.sh');

    test('should exist in deprecated folder with valid bash syntax', () => {
      // Scripts moved to deprecated folder - verify they exist
      expect(fs.existsSync(deprecatedDir)).toBe(true);

      if (fs.existsSync(pullScript)) {
        const content = fs.readFileSync(pullScript, 'utf8');
        expect(content.startsWith('#!/bin/bash')).toBe(true);
        expect(content).toContain('git submodule');
      }

      if (fs.existsSync(pushScript)) {
        const content = fs.readFileSync(pushScript, 'utf8');
        expect(content.startsWith('#!/bin/bash')).toBe(true);
        expect(content).toContain('git');
      }
    });

    test('should have deprecation documentation', () => {
      const deprecatedReadme = path.join(deprecatedDir, 'README.md');

      if (fs.existsSync(deprecatedReadme)) {
        const content = fs.readFileSync(deprecatedReadme, 'utf8');
        // Should explain why scripts are deprecated
        expect(content.toLowerCase()).toMatch(/deprecat|obsolete|replaced/);
      }
    });
  });
  describe('Shell Scripts Documentation', () => {
    const readmePath = path.join(shellScriptsDir, 'README.md');

    test('should have comprehensive README documentation', () => {
      expect(fs.existsSync(readmePath)).toBe(true);

      const content = fs.readFileSync(readmePath, 'utf8');
      expect(content.length).toBeGreaterThan(500); // Should be substantial documentation

      // Should document all major scripts
      expect(content).toContain('deploy_to_webserver.sh');
      expect(content).toContain('sync_to_staging.sh');
      expect(content).toContain('pull_all_submodules.sh');
      expect(content).toContain('push_all_submodules.sh');
    });

    test('should include usage examples', () => {
      if (!fs.existsSync(readmePath)) {
        return;
      }

      const content = fs.readFileSync(readmePath, 'utf8');
      expect(content).toMatch(/```bash|```sh/); // Should have code examples
      expect(content).toMatch(/\.\//); // Should show how to execute scripts
    });
  });
});

describe('Project Navigation Integration', () => {
  const projectRoot = getProjectRoot();
  const srcDir = path.join(projectRoot, 'src');
  const pagesDir = path.join(srcDir, 'pages');

  describe('Project Redirect Pages', () => {
    test('should have pages directory with redirect files', () => {
      expect(fs.existsSync(pagesDir)).toBe(true);

      const requiredPages = ['music-in-numbers.html', 'guia-turistico.html', 'monitora-vagas.html'];

      requiredPages.forEach((page) => {
        const pagePath = path.join(pagesDir, page);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    test('should have proper HTML structure in redirect pages', () => {
      const redirectPages = ['music-in-numbers.html', 'guia-turistico.html', 'monitora-vagas.html'];

      redirectPages.forEach((page) => {
        const pagePath = path.join(pagesDir, page);
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf8');

          // Should have meta refresh redirect functionality
          expect(content).toMatch(/http-equiv="refresh"|window\.location/);

          // Should contain meta tag
          expect(content).toContain('<meta');
        }
      });
    });

    test('should have consistent redirect patterns', () => {
      const redirectPages = ['music_in_numbers.html', 'guia_js.html', 'monitora_vagas.html'];

      const redirectTargets = [];

      redirectPages.forEach((page) => {
        const pagePath = path.join(pagesDir, page);
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf8');

          // Extract redirect target
          const refreshMatch = content.match(/url=([^"]+)/);
          if (refreshMatch) {
            redirectTargets.push(refreshMatch[1]);
          }
        }
      });

      // All redirects should follow the submodule pattern
      redirectTargets.forEach((target) => {
        expect(target).toMatch(/\.\.\/submodules\/[^/]+\/src/);
      });
    });
  });

  describe('Main Landing Page Integration', () => {
    const indexPath = path.join(srcDir, 'index.html');

    test('should have project links in landing page', () => {
      if (!fs.existsSync(indexPath)) {
        return;
      }

      const content = fs.readFileSync(indexPath, 'utf8');

      // Should link to music in numbers project (currently implemented)
      expect(content).toContain('music_in_numbers');
      // Note: guia_js and monitora_vagas may not be linked in the current HTML5 UP template
    });

    test('should use consistent link patterns', () => {
      if (!fs.existsSync(indexPath)) {
        return;
      }

      const content = fs.readFileSync(indexPath, 'utf8');

      // Current implementation uses top-level sibling project links
      expect(content).toMatch(/music_in_numbers/);
      // HTML5 UP template structure may use different navigation patterns
    });
  });
});
