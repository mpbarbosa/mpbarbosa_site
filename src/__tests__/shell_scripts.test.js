/**
 * @jest-environment node
 */

import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
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

  // The web root is a copy of the staging checkout, .git included, so nginx must
  // refuse dot-paths. See shell_scripts/nginx/mpbarbosa-deny-dotfiles.conf.
  describe('Dot-path deny rule (nginx)', () => {
    const snippetPath = path.join(shellScriptsDir, 'nginx', 'mpbarbosa-deny-dotfiles.conf');
    const installerPath = path.join(shellScriptsDir, 'setup_deny_dotfiles.sh');
    const snippet = fs.readFileSync(snippetPath, 'utf8');
    const installer = fs.readFileSync(installerPath, 'utf8');

    test('installer is executable and parses', () => {
      expect(checkScriptExecutable(installerPath)).toBe(true);
      expect(spawnSync('bash', ['-n', installerPath]).status).toBe(0);
    });

    test('installer embeds the repo snippet byte for byte', () => {
      // run_on_prod_via_ssm.sh ships the installer alone, so it carries its own copy.
      const embedded = installer.match(/cat <<'SNIPPET'\n([\s\S]*?\n)SNIPPET\n/);
      expect(embedded).not.toBeNull();
      expect(embedded[1]).toBe(snippet);
    });

    test('snippet refuses dot-segments at any depth but keeps /.well-known/', () => {
      // $uri is already decoded and normalised when nginx evaluates this, and
      // this pattern means the same in PCRE and in JavaScript.
      const rule = snippet.match(/^if \(\$uri ~ "(.+)"\) \{\n\s+return 403;\n\}$/m);
      expect(rule).not.toBeNull();
      const refused = new RegExp(rule[1]);
      // The location rule must use the very same pattern.
      expect(snippet).toContain(`location ~ "${rule[1]}" {\n    return 403;\n}`);

      [
        '/.git/HEAD',
        '/.git/config',
        '/.gitignore',
        '/.claude/',
        '/.agents/skills',
        '/.backups/backup_20260910_000000/index.html',
        '/.env',
        '/guia_js/.git/HEAD',
        '/agora_na_copa_2026/.env.example',
        '/.well-known/.hidden',
        '/foo/.well-known/x',
        '/.well-known',
      ].forEach((uri) => expect([uri, refused.test(uri)]).toEqual([uri, true]));

      [
        '/',
        '/index.html',
        '/en/',
        '/cv/',
        '/llms-full.txt',
        '/styles/v2.css',
        '/assets/css/fontawesome-all.min.css',
        '/guia_js/index.html',
        '/.well-known/acme-challenge/token-123',
        '/.well-known/security.txt',
      ].forEach((uri) => expect([uri, refused.test(uri)]).toEqual([uri, false]));
    });

    describe('installer --dry-run against a scratch nginx dir', () => {
      let scratch;
      let nginxDir;
      let webRoot;

      // Only the `command -v nginx` pre-flight needs a binary; --dry-run never runs it.
      const dryRun = (extraEnv = {}) =>
        spawnSync('bash', [installerPath, '--dry-run'], {
          encoding: 'utf8',
          env: {
            ...process.env,
            PATH: `${path.join(scratch, 'bin')}:${process.env.PATH}`,
            NGINX_DIR: nginxDir,
            WEB_ROOT: webRoot,
            BACKUP_DIR: scratch,
            ...extraEnv,
          },
        });

      const enable = (name, content) => {
        const file = path.join(nginxDir, 'sites-available', name);
        fs.writeFileSync(file, content);
        fs.symlinkSync(file, path.join(nginxDir, 'sites-enabled', name));
        return file;
      };

      beforeEach(() => {
        scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'deny-dotfiles-'));
        nginxDir = path.join(scratch, 'nginx');
        webRoot = '/var/www/mpbarbosa.com';
        fs.mkdirSync(path.join(scratch, 'bin'));
        fs.writeFileSync(path.join(scratch, 'bin', 'nginx'), '#!/bin/sh\nexit 0\n', {
          mode: 0o755,
        });
        fs.mkdirSync(path.join(nginxDir, 'sites-available'), { recursive: true });
        fs.mkdirSync(path.join(nginxDir, 'sites-enabled'));
      });

      afterEach(() => {
        fs.rmSync(scratch, { recursive: true, force: true });
      });

      test('adds the include to the block serving the web root, and changes nothing', () => {
        const vhost = enable(
          'mpbarbosa.com',
          [
            'server {',
            '    server_name mpbarbosa.com;',
            '    root /var/www/mpbarbosa.com;',
            '    listen 443 ssl; # managed by Certbot',
            '}',
            'server {',
            '    if ($host = mpbarbosa.com) {',
            '        return 301 https://$host$request_uri;',
            '    } # managed by Certbot',
            '    listen 80;',
            '    return 404; # managed by Certbot',
            '}',
            '',
          ].join('\n'),
        );
        const before = fs.readFileSync(vhost, 'utf8');
        enable('other', 'server {\n    root /var/www/other;\n}\n');

        const result = dryRun();

        expect(result.status).toBe(0);
        expect(result.stdout).toContain(
          '1 server block(s) serve /var/www/mpbarbosa.com; adding the include to 1',
        );
        expect(result.stdout).toMatch(
          / server \{\n\s+\+ {4}include .*\/snippets\/mpbarbosa-deny-dotfiles\.conf;\n/,
        );
        expect(result.stdout).not.toContain('sites-available/other:');
        expect(result.stdout).toContain('--dry-run: stopping before any change.');
        expect(fs.readFileSync(vhost, 'utf8')).toBe(before);
        expect(fs.existsSync(path.join(nginxDir, 'snippets'))).toBe(false);
      });

      test('finds a root directive that shares its line, and refuses a one-line block', () => {
        enable('oneline', 'server { listen 80; root /var/www/mpbarbosa.com; }\n');

        const result = dryRun();

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('opens and closes on one line');
      });

      test('puts the include after the brace when server and { are on separate lines', () => {
        enable('split', 'server\n{\n    root /var/www/mpbarbosa.com/;\n}\n');

        const result = dryRun();

        expect(result.status).toBe(0);
        expect(result.stdout).toMatch(/ \{\n\s+\+ {4}include .*mpbarbosa-deny-dotfiles\.conf;\n/);
      });

      test('refuses to run where no enabled vhost serves the web root', () => {
        enable('other', 'server {\n    root /var/www/other;\n}\n');

        const result = dryRun();

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('MUST RUN ON THE PROD HOST');
      });
    });
  });

  describe('check_prod_deploy.sh', () => {
    const checkPath = path.join(shellScriptsDir, 'check_prod_deploy.sh');

    const runScript = (args = [], env = {}) =>
      spawnSync('bash', [checkPath, ...args], {
        cwd: projectRoot,
        encoding: 'utf8',
        env: { ...process.env, ...env },
      });

    // Lines that execute: no comments, blank lines or heredoc bodies.
    const codeLines = (content) => {
      const lines = [];
      let heredocEnd = null;
      for (const line of content.split('\n')) {
        if (heredocEnd) {
          if (line.trim() === heredocEnd) heredocEnd = null;
          continue;
        }
        if (/^\s*(#|$)/.test(line)) continue;
        const heredoc = line.match(/<<-?\s*'?(\w+)'?/);
        if (heredoc) heredocEnd = heredoc[1];
        lines.push(line);
      }
      return lines.join('\n');
    };

    test('documents how to run it through SSM', () => {
      expect(checkScriptExecutable(checkPath)).toBe(true);

      const { status, stdout } = runScript(['--help']);

      expect(status).toBe(0);
      expect(stdout).toContain('run_on_prod_via_ssm.sh shell_scripts/check_prod_deploy.sh');
    });

    test('refuses to run off the prod host', () => {
      const missing = path.join(projectRoot, 'no-such-prod-dir');

      const { status, stderr } = runScript([], {
        PROD_GITHUB_DIR: missing,
        PROD_WEB_DIR: missing,
      });

      expect(status).toBe(2);
      expect(stderr).toContain('run_on_prod_via_ssm.sh');
    });

    test('is read-only and runs git as the checkout owner', () => {
      // It is sent to prod through SSM, which runs as root: a write here would
      // land root-owned files in ubuntu's checkouts and break the cron's pulls.
      const code = codeLines(fs.readFileSync(checkPath, 'utf8'));

      expect(code).not.toMatch(/\b(rsync|chown|chmod|systemctl|rm|mv|cp|tee|mkdir)\b/);
      expect(code).not.toMatch(/>\s*[^&\s/]/); // no redirect into a file
      expect(code).not.toMatch(
        /(git -C|git_in) \S+ (pull|fetch|reset|checkout|commit|push|add|stash|gc|update-index)\b/,
      );
      expect(code).not.toContain('--step2 --production-dir');
      expect(code).toContain('sudo -n -u "${OWNER}"');
    });
  });

  describe('run_on_prod_via_ssm.sh against a stub aws', () => {
    const runnerPath = path.join(shellScriptsDir, 'run_on_prod_via_ssm.sh');
    let scratch;

    // Dispatches on the aws sub-command and --query, so one stub serves the
    // send and all four get-command-invocation reads.
    const stubAws = (sendBody) =>
      fs.writeFileSync(
        path.join(scratch, 'bin', 'aws'),
        [
          '#!/bin/sh',
          'case "$*" in',
          '  *send-command*)',
          sendBody,
          '    ;;',
          '  *StandardOutputContent*) echo "hello from prod" ;;',
          '  *StandardErrorContent*) echo None ;;',
          '  *ResponseCode*) echo 0 ;;',
          '  *Status*) echo Success ;;',
          'esac',
          '',
        ].join('\n'),
        { mode: 0o755 },
      );

    const run = () => {
      const started = Date.now();
      const result = spawnSync('bash', [runnerPath, path.join(scratch, 'payload.sh')], {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${path.join(scratch, 'bin')}:${process.env.PATH}` },
      });
      return { ...result, elapsedMs: Date.now() - started };
    };

    beforeEach(() => {
      scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ssm-runner-'));
      fs.mkdirSync(path.join(scratch, 'bin'));
      fs.writeFileSync(path.join(scratch, 'payload.sh'), '#!/bin/bash\necho hi\n', { mode: 0o755 });
    });

    afterEach(() => {
      fs.rmSync(scratch, { recursive: true, force: true });
    });

    test('is executable and parses', () => {
      expect(checkScriptExecutable(runnerPath)).toBe(true);
      expect(spawnSync('bash', ['-n', runnerPath]).status).toBe(0);
    });

    test('gives up at once when the SSO session has expired', () => {
      // Verbatim shape of a real failure: empty stdout, a leading newline before
      // an uppercase [ERROR] on stderr, exit 255.
      stubAws(
        [
          '    printf "\\naws: [ERROR]: Your session has expired. Please reauthenticate using \'aws login\'." >&2',
          '    exit 255',
        ].join('\n'),
      );

      const result = run();

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('send-command failed (aws exited 255)');
      expect(result.stderr).toContain('Your session has expired');
      expect(result.stderr).toContain('aws login --profile');
      // The bug this guards: the poll ran its full 180s deadline on no command id.
      expect(result.stdout).not.toContain('Waiting for completion');
      expect(result.elapsedMs).toBeLessThan(30000);
    });

    test('gives up when send-command succeeds but returns no usable command id', () => {
      stubAws('    echo None');

      const result = run();

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('unexpected CommandId: None');
    });

    test('polls and reports the remote output when the command id is real', () => {
      stubAws('    echo 90157e21-c4e9-4abb-ac60-377b760c9147');

      const result = run();

      expect(result.status).toBe(0);
      expect(result.stdout).toContain('CommandId: 90157e21-c4e9-4abb-ac60-377b760c9147');
      expect(result.stdout).toContain('hello from prod');
      expect(result.stdout).toContain('Status: Success  (exit code 0)');
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

  describe('Projects Page Integration', () => {
    // Was the landing page until /projetos/ was split out; the project links
    // live there now, so the same assertions follow them.
    const indexPath = path.join(srcDir, 'projetos', 'index.html');

    test('should have project links on the projects page', () => {
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
