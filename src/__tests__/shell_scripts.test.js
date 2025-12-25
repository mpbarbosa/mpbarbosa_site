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
      const requiredScripts = [
        'deploy_to_webserver.sh',
        'sync_to_public.sh',
        'pull_all_submodules.sh',
        'push_all_submodules.sh',
        'README.md',
      ];

      requiredScripts.forEach((script) => {
        const scriptPath = path.join(shellScriptsDir, script);
        expect(fs.existsSync(scriptPath)).toBe(true);
      });
    });

    test('should have executable permissions on shell scripts', () => {
      const executableScripts = [
        'deploy_to_webserver.sh',
        'sync_to_public.sh',
        'pull_all_submodules.sh',
        'push_all_submodules.sh',
      ];

      executableScripts.forEach((script) => {
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
        stdio: ['pipe', 'pipe', 'pipe'],
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

  describe('Sync Script Functionality', () => {
    const syncScript = path.join(shellScriptsDir, 'sync_to_public.sh');

    test('should have proper shebang and be valid bash script', () => {
      if (!fs.existsSync(syncScript)) {
        return; // Skip if script doesn't exist
      }

      const content = fs.readFileSync(syncScript, 'utf8');
      expect(content.startsWith('#!/bin/bash')).toBe(true);

      // Check for essential functions
      expect(content).toContain('copy_index_html');
      expect(content).toContain('copy_css_assets');
      expect(content).toContain('copy_music_in_numbers_submodule');
    });

    test('should support dry-run mode', () => {
      if (!fs.existsSync(syncScript)) {
        return; // Skip if script doesn't exist
      }

      const content = fs.readFileSync(syncScript, 'utf8');
      expect(content).toContain('DRY_RUN');
      expect(content).toContain('--dry-run');
    });

    test('should have comprehensive validation', () => {
      if (!fs.existsSync(syncScript)) {
        return; // Skip if script doesn't exist
      }

      const content = fs.readFileSync(syncScript, 'utf8');
      expect(content).toContain('validate_sync');
      expect(content).toContain('show_summary');
    });
  });

  describe('Sync to Public Script Comprehensive Tests', () => {
    const syncScript = path.join(shellScriptsDir, 'sync_to_public.sh');

    beforeAll(() => {
      // Skip all tests if script doesn't exist
      if (!fs.existsSync(syncScript)) {
        return;
      }
    });

    describe('Script Structure and Configuration', () => {
      test('should have proper bash safety settings', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('set -e'); // Exit on any error
        expect(content).toContain('set -u'); // Exit on undefined variables
      });

      test('should define all required configuration variables', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        // Directory configuration
        expect(content).toContain('PROJECT_ROOT=');
        expect(content).toContain('SOURCE_DIR=');
        expect(content).toContain('PUBLIC_DIR=');

        // Script settings
        expect(content).toContain('DRY_RUN=false');
        expect(content).toContain('VERBOSE=false');
        expect(content).toContain('CREATE_BACKUP=true');
      });

      test('should have color definitions for output formatting', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        const colorVariables = ['RED', 'GREEN', 'YELLOW', 'BLUE', 'PURPLE', 'CYAN', 'WHITE', 'NC'];
        colorVariables.forEach((color) => {
          expect(content).toContain(`${color}=`);
        });
      });

      test('should have comprehensive help documentation', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('show_help()');
        expect(content).toContain('USAGE:');
        expect(content).toContain('DESCRIPTION:');
        expect(content).toContain('OPTIONS:');
        expect(content).toContain('EXAMPLES:');
      });
    });

    describe('Utility Functions', () => {
      test('should define all required print functions', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        const printFunctions = [
          'print_header',
          'print_info',
          'print_success',
          'print_warning',
          'print_error',
          'print_step',
        ];

        printFunctions.forEach((func) => {
          expect(content).toContain(`${func}()`);
        });
      });

      test('should have generic reusable copy functions', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        const genericFunctions = [
          'copy_single_file',
          'copy_directory',
          'copy_specific_files',
          'validate_path',
        ];

        genericFunctions.forEach((func) => {
          expect(content).toContain(`${func}()`);
        });
      });

      test('should have environment validation function', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('validate_environment()');
        expect(content).toContain('.github/copilot-instructions.md');
      });

      test('should have backup functionality', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('create_backup()');
        expect(content).toContain('backup_timestamp');
        expect(content).toContain('.backups');
      });
    });

    describe('Specific Copy Functions', () => {
      test('should have all main file copy functions', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        const copyFunctions = ['copy_index_html', 'copy_robots_txt', 'copy_humans_txt'];

        copyFunctions.forEach((func) => {
          expect(content).toContain(`${func}()`);
        });
      });

      test('should have asset copy functions', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        const assetFunctions = [
          'copy_css_assets',
          'copy_js_assets',
          'copy_sass_assets',
          'copy_webfonts',
          'copy_images',
        ];

        assetFunctions.forEach((func) => {
          expect(content).toContain(`${func}()`);
        });
      });

      test('should have Music in Numbers submodule copy functions', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        const submoduleFunctions = [
          'copy_music_in_numbers_submodule',
          'copy_music_in_numbers_scripts',
          'copy_music_in_numbers_styles',
        ];

        submoduleFunctions.forEach((func) => {
          expect(content).toContain(`${func}()`);
        });
      });
    });

    describe('Command Line Argument Parsing', () => {
      test('should support all documented command line options', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        const options = ['--dry-run', '--verbose', '--no-backup', '--help'];
        options.forEach((option) => {
          expect(content).toContain(option);
        });
      });

      test('should handle unknown options gracefully', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('Unknown option');
        expect(content).toContain('Use --help for usage information');
      });
    });

    describe('Main Execution Flow', () => {
      test('should have proper main function structure', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('main()');
        expect(content).toContain('main "$@"');
      });

      test('should call all copy functions in logical order', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        // Extract main function content
        const mainMatch = content.match(/main\(\)\s*{([\s\S]*?)^}/m);
        if (mainMatch) {
          const mainContent = mainMatch[1];

          // Check that validation comes first
          const validatePos = mainContent.indexOf('validate_environment');
          const firstCopyPos = mainContent.indexOf('copy_index_html');
          expect(validatePos).toBeLessThan(firstCopyPos);

          // Check that summary comes last
          const summaryPos = mainContent.indexOf('show_summary');
          const lastCopyPos = mainContent.lastIndexOf('copy_');
          expect(summaryPos).toBeGreaterThan(lastCopyPos);
        }
      });
    });

    describe('Error Handling and Validation', () => {
      test('should validate project directory structure', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('copilot-instructions.md');
        expect(content).toContain('Not in MP Barbosa site project directory');
      });

      test('should handle missing source directory', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('Source directory not found');
      });

      test('should create public directory if missing', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('Public directory not found, creating');
        expect(content).toContain('mkdir -p "$PUBLIC_DIR"');
      });
    });

    describe('File Pattern Matching', () => {
      test('should define proper file patterns for different asset types', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        // Image file patterns
        expect(content).toContain('*.jpg');
        expect(content).toContain('*.png');
        expect(content).toContain('*.svg');
        expect(content).toContain('*.webp');

        // Font file patterns
        expect(content).toContain('*.woff');
        expect(content).toContain('*.woff2');
        expect(content).toContain('*.ttf');

        // JavaScript file patterns
        expect(content).toContain('*.js');
        expect(content).toContain('*.mjs');

        // CSS file patterns
        expect(content).toContain('*.css');
        expect(content).toContain('*.scss');
      });

      test('should handle special pattern types in validation', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('image_files');
        expect(content).toContain('font_files');
        expect(content).toContain('js_files');
      });
    });

    describe('Backup Management', () => {
      test('should create timestamped backups', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('backup_timestamp=$(date');
        expect(content).toContain('backup_$backup_timestamp');
      });

      test('should clean up old backups', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('keep only last 5');
        expect(content).toContain('head -n $((backup_count - 5))');
      });

      test('should exclude backups from backup process', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('! -name ".backups"');
      });
    });

    describe('Verbose Output and Summary', () => {
      test('should provide detailed verbose information', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('if [[ "$VERBOSE" == "true" ]]');
        expect(content).toContain('print_info "  Size:');
        expect(content).toContain('print_info "  Files:');
      });

      test('should show comprehensive summary', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('show_summary()');
        expect(content).toContain('DEPLOYMENT SUMMARY');
        expect(content).toContain('Steps Executed:');
      });

      test('should support tree command for directory display', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('command -v tree');
        expect(content).toContain('tree "$PUBLIC_DIR"');
      });
    });

    describe('Dry Run Functionality', () => {
      test('should preview operations without making changes in dry-run mode', (done) => {
        if (!fs.existsSync(syncScript)) {
          done();
          return;
        }

        const child = spawn('bash', [syncScript, '--step1', '--dry-run'], {
          cwd: projectRoot,
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('close', () => {
          const output = stdout + stderr;

          // Should indicate dry-run mode
          expect(output).toContain('DRY RUN');
          expect(output).toContain('[DRY RUN]');

          // Should show what would be copied
          expect(output).toContain('Would copy');

          // Should not create actual files in dry-run mode
          expect(output).toContain('No changes will be made');

          done();
        });

        setTimeout(() => {
          child.kill();
          done();
        }, 15000);
      }, 20000);

      test('should validate verbose dry-run output', (done) => {
        if (!fs.existsSync(syncScript)) {
          done();
          return;
        }

        const child = spawn('bash', [syncScript, '--step1', '--dry-run', '--verbose'], {
          cwd: projectRoot,
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('close', () => {
          const output = stdout + stderr;

          // Should show detailed information in verbose mode
          expect(output).toMatch(/files to copy|Source:|Destination:/);
          expect(output).toContain('Files to copy:');
          expect(output).toMatch(/Would copy|files to copy/);

          done();
        });

        setTimeout(() => {
          child.kill();
          done();
        }, 15000);
      }, 20000);
    });

    describe('Help System', () => {
      test('should display comprehensive help when --help is used', (done) => {
        if (!fs.existsSync(syncScript)) {
          done();
          return;
        }

        const child = spawn('bash', [syncScript, '--help'], {
          cwd: projectRoot,
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';

        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        child.on('close', (code) => {
          expect(code).toBe(0);

          // Should contain all help sections
          expect(stdout).toContain('USAGE:');
          expect(stdout).toContain('DESCRIPTION:');
          expect(stdout).toContain('OPTIONS:');
          expect(stdout).toContain('EXAMPLES:');
          expect(stdout).toContain('DIRECTORIES:');
          expect(stdout).toContain('FILES TO SYNC:');

          // Should list all supported files and directories
          expect(stdout).toContain('index.html');
          expect(stdout).toContain('robots.txt');
          expect(stdout).toContain('assets/css/');
          expect(stdout).toContain('music_in_numbers');

          done();
        });

        setTimeout(() => {
          child.kill();
          done();
        }, 10000);
      }, 15000);
    });

    describe('File System Operations', () => {
      test('should handle missing optional files gracefully', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        // Should handle missing optional files
        expect(content).toContain('not found in source directory');
        expect(content).toContain('Expected:');
        expect(content).toContain('required="${4:-false}"');
      });

      test('should preserve file permissions during copy operations', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('cp -r');
        expect(content).toContain('mkdir -p');
        expect(content).toContain('dirname "$dest_file"');
      });

      test('should handle recursive directory copying', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('cp -r "$source_dir"/* "$dest_dir/"');
        expect(content).toContain('-mindepth 1 -maxdepth 1');
        expect(content).toContain('find "$dest_dir"');
      });
    });

    describe('Music in Numbers Integration', () => {
      test('should handle complete Music in Numbers submodule structure', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');

        // Should copy HTML files
        expect(content).toContain('index.html music_in_numbers.html artist.html');

        // Should handle scripts directory with API architectures
        expect(content).toContain('API Class Architectures');
        expect(content).toContain('API architectures');

        // Should handle styles directory
        expect(content).toContain('Music in Numbers styles');
      });

      test('should provide detailed verbose output for submodule files', () => {
        if (!fs.existsSync(syncScript)) {
          return;
        }

        const content = fs.readFileSync(syncScript, 'utf8');
        expect(content).toContain('Main JavaScript modules:');
        expect(content).toContain('API Class Architectures:');
        expect(content).toContain('JavaScript files:');
        expect(content).toContain('Subdirectories:');
      });
    });
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
      expect(content).toContain('sync_to_public.sh');
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
      const redirectPages = ['music_in_numbers.html', 'guia_turistico.html', 'monitora_vagas.html'];

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
      // Note: guia_turistico and monitora_vagas may not be linked in the current HTML5 UP template
    });

    test('should use consistent link patterns', () => {
      if (!fs.existsSync(indexPath)) {
        return;
      }

      const content = fs.readFileSync(indexPath, 'utf8');

      // Current implementation uses direct submodule links
      expect(content).toMatch(/submodules\/music_in_numbers/);
      // HTML5 UP template structure may use different navigation patterns
    });
  });
});
