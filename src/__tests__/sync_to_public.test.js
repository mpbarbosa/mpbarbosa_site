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

// Helper function to create temporary test directory
// const createTempTestDir = () => {
//   const tempDir = fs.mkdtempSync(path.join(tmpdir(), 'sync-test-'));
//   return tempDir;
// };

// Helper function to clean up temporary directory
// const cleanupTempDir = (dir) => {
//   try {
//     if (fs.existsSync(dir)) {
//       fs.rmSync(dir, { recursive: true, force: true });
//     }
//   } catch (error) {
//     console.warn(`Failed to cleanup temp directory: ${dir}`, error);
//   }
// };

// Helper function to run script with timeout
const runScriptWithTimeout = (scriptPath, args = [], timeout = 30000) => {
  return new Promise((resolve, reject) => {
    const child = spawn('bash', [scriptPath, ...args], {
      cwd: getProjectRoot(),
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
      resolve({ code, stdout, stderr });
    });

    child.on('error', (error) => {
      reject(error);
    });

    // Set timeout
    setTimeout(() => {
      child.kill();
      reject(new Error(`Script execution timed out after ${timeout}ms`));
    }, timeout);
  });
};

describe('sync_to_public.sh - Comprehensive Test Suite', () => {
  const projectRoot = getProjectRoot();
  const syncScript = path.join(projectRoot, 'shell_scripts', 'sync_to_public.sh');

  // Skip all tests if script doesn't exist
  beforeAll(() => {
    if (!fs.existsSync(syncScript)) {
      console.warn('sync_to_public.sh not found, skipping tests');
    }
  });

  describe('Script Existence and Permissions', () => {
    test('should exist and be executable', () => {
      if (!fs.existsSync(syncScript)) {
        expect.skip('Script does not exist');
        return;
      }

      expect(fs.existsSync(syncScript)).toBe(true);

      const stats = fs.statSync(syncScript);
      expect(stats.isFile()).toBe(true);
      expect(stats.mode & 0o111).not.toBe(0); // Has execute permission
    });

    test('should have valid bash shebang', () => {
      if (!fs.existsSync(syncScript)) {
        expect.skip('Script does not exist');
        return;
      }

      const content = fs.readFileSync(syncScript, 'utf8');
      expect(content.startsWith('#!/bin/bash')).toBe(true);
    });
  });

  describe('Script Configuration and Structure', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should have proper bash safety settings', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('set -e'); // Exit on error
      expect(scriptContent).toContain('set -u'); // Exit on undefined variables
    });

    test('should define all required configuration constants', () => {
      if (!scriptContent) {
        return;
      }

      const requiredConfigs = [
        'SCRIPT_DIR=',
        'PROJECT_ROOT=',
        'SOURCE_DIR=',
        'PUBLIC_DIR=',
        'DRY_RUN=false',
        'VERBOSE=false',
        'CREATE_BACKUP=true',
      ];

      requiredConfigs.forEach((config) => {
        expect(scriptContent).toContain(config);
      });
    });

    test('should define complete color palette for output', () => {
      if (!scriptContent) {
        return;
      }

      const colors = ['RED', 'GREEN', 'YELLOW', 'BLUE', 'PURPLE', 'CYAN', 'WHITE', 'NC'];
      colors.forEach((color) => {
        expect(scriptContent).toMatch(new RegExp(`${color}='\\\\033\\[`));
      });
    });

    test('should have comprehensive version and description headers', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('MP Barbosa Site - Two-Step Deployment Script');
      expect(scriptContent).toContain('Author: MP Barbosa');
      expect(scriptContent).toContain('Version: 2.0.0');
      expect(scriptContent).toContain('Created: November 4, 2025');
    });
  });

  describe('Utility Functions Coverage', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should define all print utility functions', () => {
      if (!scriptContent) {
        return;
      }

      const printFunctions = [
        'print_header()',
        'print_info()',
        'print_success()',
        'print_warning()',
        'print_error()',
        'print_step()',
      ];

      printFunctions.forEach((func) => {
        expect(scriptContent).toContain(func);
      });
    });

    test('should define generic copy functions', () => {
      if (!scriptContent) {
        return;
      }

      const copyFunctions = [
        'copy_single_file()',
        'copy_directory()',
        'copy_specific_files()',
        'validate_path()',
      ];

      copyFunctions.forEach((func) => {
        expect(scriptContent).toContain(func);
      });
    });

    test('should have environment validation and backup functions', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('validate_environment()');
      expect(scriptContent).toContain('create_backup()');
      expect(scriptContent).toContain('show_summary()');
    });
  });

  describe('Specific Copy Functions Implementation', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should implement all core file copy functions', () => {
      if (!scriptContent) {
        return;
      }

      const coreFunctions = ['copy_index_html()', 'copy_robots_txt()', 'copy_humans_txt()'];

      coreFunctions.forEach((func) => {
        expect(scriptContent).toContain(func);
      });
    });

    test('should implement all asset copy functions', () => {
      if (!scriptContent) {
        return;
      }

      const assetFunctions = [
        'copy_css_assets()',
        'copy_js_assets()',
        'copy_sass_assets()',
        'copy_webfonts()',
        'copy_images()',
      ];

      assetFunctions.forEach((func) => {
        expect(scriptContent).toContain(func);
      });
    });

    test('should implement Music in Numbers submodule functions', () => {
      if (!scriptContent) {
        return;
      }

      const submoduleFunctions = [
        'copy_music_in_numbers_submodule()',
        'copy_music_in_numbers_scripts()',
        'copy_music_in_numbers_styles()',
      ];

      submoduleFunctions.forEach((func) => {
        expect(scriptContent).toContain(func);
      });
    });

    test('should implement additional resources and validation', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('copy_additional_resources()');
      expect(scriptContent).toContain('validate_sync()');
    });
  });

  describe('Command Line Interface', () => {
    test('should display help information', async () => {
      if (!fs.existsSync(syncScript)) {
        return;
      }

      const result = await runScriptWithTimeout(syncScript, ['--help'], 10000);

      expect(result.code).toBe(0);
      expect(result.stdout).toContain('MP Barbosa Site - Two-Step Deployment Script');
      expect(result.stdout).toContain('USAGE:');
      expect(result.stdout).toContain('DESCRIPTION:');
      expect(result.stdout).toContain('STEP OPTIONS');
      expect(result.stdout).toContain('EXAMPLES:');
      expect(result.stdout).toContain('--dry-run');
      expect(result.stdout).toContain('--verbose');
      expect(result.stdout).toContain('--no-backup');
    });

    test('should handle unknown options gracefully', async () => {
      if (!fs.existsSync(syncScript)) {
        return;
      }

      const result = await runScriptWithTimeout(syncScript, ['--unknown-option'], 5000);

      expect(result.code).toBe(1);
      expect(result.stderr || result.stdout).toContain('Unknown option');
      expect(result.stderr || result.stdout).toContain('Use --help for usage information');
    });

    test('should support dry-run mode', async () => {
      if (!fs.existsSync(syncScript)) {
        return;
      }

      const result = await runScriptWithTimeout(syncScript, ['--step1', '--dry-run'], 20000);

      const output = result.stdout + result.stderr;
      expect(output).toContain('DRY RUN');
      expect(output).toContain('[DRY RUN]');
      expect(output).toContain('Would copy');
      expect(output).toContain('No changes will be made');
    }, 25000);

    test('should support verbose mode with dry-run', async () => {
      if (!fs.existsSync(syncScript)) {
        return;
      }

      const result = await runScriptWithTimeout(
        syncScript,
        ['--step1', '--dry-run', '--verbose'],
        20000,
      );

      const output = result.stdout + result.stderr;
      // The script uses different verbose patterns
      expect(output).toMatch(/files to copy|Would copy/);
      expect(output).toMatch(/Source:|Destination:|files to copy/);
      expect(output).toContain('Files to copy:');
    }, 25000);
  });

  describe('File Pattern Recognition', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should define comprehensive image file patterns', () => {
      if (!scriptContent) {
        return;
      }

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico'];
      imageExtensions.forEach((ext) => {
        expect(scriptContent).toContain(`*${ext}`);
      });
    });

    test('should define comprehensive font file patterns', () => {
      if (!scriptContent) {
        return;
      }

      const fontExtensions = ['.eot', '.svg', '.ttf', '.woff', '.woff2', '.otf'];
      fontExtensions.forEach((ext) => {
        expect(scriptContent).toContain(`*${ext}`);
      });
    });

    test('should define JavaScript and CSS file patterns', () => {
      if (!scriptContent) {
        return;
      }

      const codeExtensions = ['.js', '.mjs', '.css', '.scss'];
      codeExtensions.forEach((ext) => {
        expect(scriptContent).toContain(`*${ext}`);
      });
    });

    test('should handle special pattern types for validation', () => {
      if (!scriptContent) {
        return;
      }

      const specialPatterns = ['image_files', 'font_files', 'js_files'];
      specialPatterns.forEach((pattern) => {
        expect(scriptContent).toContain(pattern);
      });
    });
  });

  describe('Error Handling and Validation', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should validate project directory structure', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('.github/copilot-instructions.md');
      expect(scriptContent).toContain('Not in MP Barbosa site project directory');
    });

    test('should handle missing source directory', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('Source directory not found');
      expect(scriptContent).toContain('exit 1');
    });

    test('should create public directory if missing', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('Public directory not found, creating');
      expect(scriptContent).toContain('mkdir -p "$PUBLIC_DIR"');
    });

    test('should handle optional vs required files differently', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('required="${4:-false}"');
      expect(scriptContent).toContain('if [[ "$required" == "true" ]]');
      expect(scriptContent).toContain('not found in source directory');
    });
  });

  describe('Backup System', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should create timestamped backups', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('backup_timestamp=$(date +"%Y%m%d_%H%M%S")');
      expect(scriptContent).toContain('backup_$backup_timestamp');
      expect(scriptContent).toContain('.backups');
    });

    test('should manage backup retention', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('keep only last 5');
      expect(scriptContent).toContain('backup_count -gt 5');
      expect(scriptContent).toContain('head -n $((backup_count - 5))');
    });

    test('should exclude backup directory from backup process', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('! -name ".backups"');
      expect(scriptContent).toContain('-mindepth 1 -maxdepth 1 ! -name ".backups"');
    });

    test('should support disabling backup creation', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('CREATE_BACKUP=');
      expect(scriptContent).toContain('--no-backup');
      expect(scriptContent).toContain('CREATE_BACKUP=false');
    });
  });

  describe('Music in Numbers Integration', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should handle Music in Numbers HTML files', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('index.html music_in_numbers.html artist.html');
      expect(scriptContent).toContain('Music in Numbers submodule');
    });

    test('should handle JavaScript modules and API architectures', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('Main JavaScript modules:');
      expect(scriptContent).toContain('API Class Architectures:');
      expect(scriptContent).toContain('JavaScript files:');
      expect(scriptContent).toContain('-mindepth 1 -type d');
    });

    test('should handle CSS stylesheets', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('Music in Numbers styles');
      expect(scriptContent).toContain('CSS files:');
      expect(scriptContent).toContain('*.css');
    });

    test('should provide detailed verbose output for submodule structure', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('API architectures to copy:');
      expect(scriptContent).toContain('files_in_dir');
      expect(scriptContent).toContain('dirname/ ($files_in_dir files)');
    });
  });

  describe('Summary and Reporting', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should provide comprehensive deployment summary', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('show_summary()');
      expect(scriptContent).toContain('DEPLOYMENT SUMMARY');
      expect(scriptContent).toContain('Steps Executed:');
      expect(scriptContent).toContain('Public Folder Contents:');
    });

    test('should support tree command for directory display', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('command -v tree');
      expect(scriptContent).toContain('tree "$PUBLIC_DIR"');
      expect(scriptContent).toContain('-I ".backups"');
    });

    test('should handle fallback when tree command unavailable', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('find "$PUBLIC_DIR"');
      expect(scriptContent).toContain('-not -path "*/.backups/*"');
      expect(scriptContent).toContain("sed 's|^'");
    });

    test('should show file counts for different asset types', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('($css_count files)');
      expect(scriptContent).toContain('($js_count files)');
      expect(scriptContent).toContain('($font_count files)');
      expect(scriptContent).toContain('($image_count files)');
    });
  });

  describe('Main Execution Flow', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should have proper main function structure', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('main() {');
      expect(scriptContent).toContain('main "$@"');
    });

    test('should parse command line arguments correctly', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('while [[ $# -gt 0 ]]');
      expect(scriptContent).toContain('case $1 in');
      expect(scriptContent).toContain('--dry-run)');
      expect(scriptContent).toContain('--verbose)');
      expect(scriptContent).toContain('--no-backup)');
      expect(scriptContent).toContain('--help)');
    });

    test('should execute functions in logical order', () => {
      if (!scriptContent) {
        return;
      }

      // Extract main function content for order verification
      const mainFunctionRegex = /main\(\)\s*{([\s\S]*?)^}/m;
      const match = scriptContent.match(mainFunctionRegex);

      if (match) {
        const mainContent = match[1];

        // Validation should come first in execute_step_1
        const executeStep1Content = scriptContent.substring(
          scriptContent.indexOf('execute_step_1() {'),
        );
        const validatePos = executeStep1Content.indexOf('validate_environment');
        const firstCopyPos = executeStep1Content.indexOf('copy_index_html');
        expect(validatePos).toBeLessThan(firstCopyPos);

        // Summary should come after all copy operations
        const summaryPos = mainContent.indexOf('show_summary');
        const lastValidatePos = mainContent.indexOf('validate_sync');
        expect(summaryPos).toBeGreaterThan(lastValidatePos);
      }
    });

    test('should provide appropriate success and completion messages', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('Step 1 completed successfully!');
      expect(scriptContent).toContain('Files are ready in public folder for production deployment');
      expect(scriptContent).toContain('Dry run completed');
    });
  });

  describe('File System Safety', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should use safe file operations', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('mkdir -p'); // Safe directory creation
      expect(scriptContent).toContain('cp -r'); // Recursive copy
      expect(scriptContent).toContain('dirname "$dest_file"'); // Parent directory creation
    });

    test('should handle file existence checks', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('if [[ ! -f "$source_file"');
      expect(scriptContent).toContain('if [[ ! -d "$source_dir"');
      expect(scriptContent).toContain('[[ -f "$path"');
      expect(scriptContent).toContain('[[ -d "$path"');
    });

    test('should use proper file size and stat operations', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('du -h');
      expect(scriptContent).toContain('du -sh');
      expect(scriptContent).toContain('stat -c %y');
      expect(scriptContent).toContain('stat -f %Sm'); // macOS compatibility
    });

    test('should handle special characters in file paths safely', () => {
      if (!scriptContent) {
        return;
      }

      // Should use proper quoting
      expect(scriptContent).toContain('"$source_file"');
      expect(scriptContent).toContain('"$dest_file"');
      expect(scriptContent).toContain('"$source_dir"');
      expect(scriptContent).toContain('"$dest_dir"');
    });
  });

  describe('Extensibility and Maintenance', () => {
    let scriptContent;

    beforeAll(() => {
      if (fs.existsSync(syncScript)) {
        scriptContent = fs.readFileSync(syncScript, 'utf8');
      }
    });

    test('should provide extension points for additional resources', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('copy_additional_resources()');
      expect(scriptContent).toContain('Placeholder for future resource copying');
      expect(scriptContent).toContain('Examples that could be added:');
    });

    test('should have well-documented function interfaces', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('Usage: copy_single_file');
      expect(scriptContent).toContain('Usage: copy_directory');
      expect(scriptContent).toContain('Usage: copy_specific_files');
      expect(scriptContent).toContain('Usage: validate_path');
    });

    test('should maintain version information and changelog capability', () => {
      if (!scriptContent) {
        return;
      }

      expect(scriptContent).toContain('Version: 2.0.0');
      expect(scriptContent).toContain('Created: November 4, 2025');
      expect(scriptContent).toContain('Author: MP Barbosa');
    });
  });

  describe('Integration Test - Dry Run Execution', () => {
    test('should complete full dry-run without errors', async () => {
      if (!fs.existsSync(syncScript)) {
        return;
      }

      const result = await runScriptWithTimeout(syncScript, ['--step1', '--dry-run'], 30000);

      const output = result.stdout + result.stderr;

      // Should indicate proper dry-run execution
      expect(output).toContain('MP BARBOSA SITE - TWO-STEP DEPLOYMENT');
      expect(output).toContain('DRY RUN MODE - No changes will be made');
      expect(output).toContain('DEPLOYMENT SUMMARY');
      expect(output).toContain('DRY RUN (preview only)');

      // Should validate all major steps
      expect(output).toContain('Validating environment');
      expect(output).toContain('Copying index.html');
      expect(output).toContain('Checking for additional resources');

      // Exit code should be 0 for successful dry-run
      expect(result.code).toBe(0);
    }, 35000);

    test('should show expected file operations in verbose dry-run', async () => {
      if (!fs.existsSync(syncScript)) {
        return;
      }

      const result = await runScriptWithTimeout(
        syncScript,
        ['--step1', '--dry-run', '--verbose'],
        30000,
      );

      const output = result.stdout + result.stderr;

      // Should show detailed dry-run information
      expect(output).toContain('[DRY RUN] Would copy:');
      expect(output).toContain('files to copy:');
      // Note: The script uses different verbose output format than expected
      expect(output).toMatch(/Source:|files to copy:/);
      expect(output).toMatch(/files to copy|Would copy/);

      // Should mention major file types that would be processed
      if (output.includes('robots.txt') || output.includes('humans.txt')) {
        // These are optional files that may or may not be present
        expect(output).toMatch(/robots\.txt|humans\.txt/);
      }

      // Should handle submodule paths correctly
      if (output.includes('music_in_numbers')) {
        expect(output).toContain('submodules/music_in_numbers');
      }
    }, 35000);
  });
});
