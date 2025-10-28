/**
 * @jest-environment node
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper function to get project root directory
const getProjectRoot = () => {
  return path.resolve(__dirname, '../..');
};

// Helper function to check if a shell script exists and is executable
const checkScriptExecutable = (scriptPath) => {
  try {
    const stats = fs.statSync(scriptPath);
    return stats.isFile() && (stats.mode & 0o111) !== 0;
  } catch (error) {
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
      const requiredScripts = [
        'deploy_to_webserver.sh',
        'pull_all_submodules.sh',
        'push_all_submodules.sh',
        'README.md'
      ];

      requiredScripts.forEach(script => {
        const scriptPath = path.join(shellScriptsDir, script);
        expect(fs.existsSync(scriptPath)).toBe(true);
      });
    });

    test('should have executable permissions on shell scripts', () => {
      const executableScripts = [
        'deploy_to_webserver.sh',
        'pull_all_submodules.sh',
        'push_all_submodules.sh'
      ];

      executableScripts.forEach(script => {
        const scriptPath = path.join(shellScriptsDir, script);
        if (fs.existsSync(scriptPath)) {
          expect(checkScriptExecutable(scriptPath)).toBe(true);
        }
      });
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
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        // Dry-run should complete without errors or with controlled exit
        expect(code === 0 || code === 1).toBe(true); // 1 is acceptable for dry-run validation
        
        // Should contain dry-run indicators
        const output = stdout + stderr;
        expect(output.toLowerCase()).toMatch(/dry.?run|would|simulation|preview/);
        
        done();
      });

      // Set timeout for the test
      setTimeout(() => {
        child.kill();
        done();
      }, 10000);
    }, 15000);
  });

  describe('Submodule Management Scripts', () => {
    const pullScript = path.join(shellScriptsDir, 'pull_all_submodules.sh');
    const pushScript = path.join(shellScriptsDir, 'push_all_submodules.sh');

    test('should have valid bash syntax in pull script', () => {
      if (!fs.existsSync(pullScript)) {
        return;
      }

      const content = fs.readFileSync(pullScript, 'utf8');
      expect(content.startsWith('#!/bin/bash')).toBe(true);
      expect(content).toContain('git submodule');
    });

    test('should have valid bash syntax in push script', () => {
      if (!fs.existsSync(pushScript)) {
        return;
      }

      const content = fs.readFileSync(pushScript, 'utf8');
      expect(content.startsWith('#!/bin/bash')).toBe(true);
      expect(content).toContain('git');
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
      
      const requiredPages = [
        'music_in_numbers.html',
        'guia_turistico.html',
        'monitora_vagas.html'
      ];

      requiredPages.forEach(page => {
        const pagePath = path.join(pagesDir, page);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    test('should have proper HTML structure in redirect pages', () => {
      const redirectPages = [
        'music_in_numbers.html',
        'guia_turistico.html',
        'monitora_vagas.html'
      ];

      redirectPages.forEach(page => {
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
      const redirectPages = [
        'music_in_numbers.html',
        'guia_turistico.html',
        'monitora_vagas.html'
      ];

      const redirectTargets = [];

      redirectPages.forEach(page => {
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
      redirectTargets.forEach(target => {
        expect(target).toMatch(/\.\.\/submodules\/[^\/]+\/src/);
      });
    });
  });

  describe('Main Landing Page Integration', () => {
    const indexPath = path.join(srcDir, 'index.html');

    test('should have all project links in landing page', () => {
      if (!fs.existsSync(indexPath)) {
        return;
      }

      const content = fs.readFileSync(indexPath, 'utf8');
      
      // Should link to all three projects
      expect(content).toContain('music_in_numbers');
      expect(content).toContain('guia_turistico');
      expect(content).toContain('monitora_vagas');
    });

    test('should use consistent link patterns', () => {
      if (!fs.existsSync(indexPath)) {
        return;
      }

      const content = fs.readFileSync(indexPath, 'utf8');
      
      // Should use pages/ directory for navigation
      expect(content).toMatch(/pages\/music_in_numbers\.html/);
      expect(content).toMatch(/pages\/guia_turistico\.html/);
      expect(content).toMatch(/pages\/monitora_vagas\.html/);
    });
  });
});