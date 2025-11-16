# Step 8: Dependency_Validation

**Workflow Run ID:** workflow_20251115_233134
**Timestamp:** 2025-11-15 23:35:06
**Status:** Issues Found

---

## Issues and Findings

### Dependency Validation Issues

**Total Issues:** 1
**Total Dependencies:** 3
**Vulnerabilities:** 46
**Outdated Packages:** 0

### npm audit Output

```
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "@istanbuljs/load-nyc-config": {
      "name": "@istanbuljs/load-nyc-config",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "js-yaml"
      ],
      "effects": [
        "babel-plugin-istanbul"
      ],
      "range": "*",
      "nodes": [
        "node_modules/@istanbuljs/load-nyc-config"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "@jest/core": {
      "name": "@jest/core",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@jest/reporters",
        "@jest/transform",
        "jest-config",
        "jest-resolve-dependencies",
        "jest-runner",
        "jest-runtime",
        "jest-snapshot"
      ],
      "effects": [
        "jest"
      ],
      "range": ">=25.1.0",
      "nodes": [
        "node_modules/@jest/core"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "@jest/expect": {
      "name": "@jest/expect",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "jest-snapshot"
      ],
      "effects": [
        "@jest/globals",
        "jest-circus"
      ],
      "range": "*",
      "nodes": [
        "node_modules/@jest/expect"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "@jest/globals": {
      "name": "@jest/globals",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@jest/expect"
      ],
      "effects": [
        "jest-runtime"
      ],
      "range": ">=28.0.0-alpha.0",
      "nodes": [
        "node_modules/@jest/globals"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "@jest/reporters": {
      "name": "@jest/reporters",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@jest/transform"
      ],
      "effects": [],
      "range": ">=25.1.0",
      "nodes": [
        "node_modules/@jest/reporters"
      ],
      "fixAvailable": true
    },
    "@jest/transform": {
      "name": "@jest/transform",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "babel-plugin-istanbul"
      ],
      "effects": [
        "@jest/core",
        "@jest/reporters",
        "jest-runner",
        "jest-runtime",
        "jest-snapshot"
      ],
      "range": ">=25.1.0",
      "nodes": [
        "node_modules/@jest/transform"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "anymatch": {
      "name": "anymatch",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "micromatch"
      ],
      "effects": [
        "chokidar"
      ],
      "range": "1.2.0 - 2.0.0",
      "nodes": [
        "node_modules/chokidar/node_modules/anymatch"
      ],
      "fixAvailable": {
        "name": "live-server",
        "version": "1.2.0",
        "isSemVerMajor": true
      }
    },
    "babel-jest": {
      "name": "babel-jest",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@jest/transform",
        "babel-plugin-istanbul"
      ],
      "effects": [
        "jest-config"
      ],
      "range": ">=25.1.0",
      "nodes": [
        "node_modules/babel-jest"
      ],
      "fixAvailable": true
    },
    "babel-plugin-istanbul": {
      "name": "babel-plugin-istanbul",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@istanbuljs/load-nyc-config"
      ],
      "effects": [
        "@jest/transform",
        "babel-jest"
      ],
      "range": ">=6.0.0-beta.0",
      "nodes": [
        "node_modules/babel-plugin-istanbul"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "braces": {
      "name": "braces",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1098094,
          "name": "braces",
          "dependency": "braces",
          "title": "Uncontrolled resource consumption in braces",
          "url": "https://github.com/advisories/GHSA-grv7-fg5c-xmjg",
          "severity": "high",
          "cwe": [
            "CWE-400",
            "CWE-1050"
          ],
          "cvss": {
            "score": 7.5,
            "vectorString": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H"
          },
          "range": "<3.0.3"
        }
      ],
      "effects": [
        "chokidar",
        "micromatch"
      ],
      "range": "<3.0.3",
      "nodes": [
        "node_modules/braces"
      ],
      "fixAvailable": {
        "name": "live-server",
        "version": "1.2.0",
        "isSemVerMajor": true
      }
    },
    "chokidar": {
      "name": "chokidar",
      "severity": "high",
      "isDirect": false,
      "via": [
        "anymatch",
        "braces",
        "readdirp"
      ],
      "effects": [
        "live-server"
      ],
      "range": "1.3.0 - 2.1.8",
      "nodes": [
        "node_modules/chokidar"
      ],
      "fixAvailable": {
        "name": "live-server",
        "version": "1.2.0",
        "isSemVerMajor": true
      }
    },
    "jest": {
      "name": "jest",
      "severity": "moderate",
      "isDirect": true,
      "via": [
        "@jest/core",
        "jest-cli"
      ],
      "effects": [],
      "range": ">=25.1.0",
      "nodes": [
        "node_modules/jest"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "jest-circus": {
      "name": "jest-circus",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@jest/expect",
        "jest-runtime",
        "jest-snapshot"
      ],
      "effects": [
        "jest-config"
      ],
      "range": ">=25.2.4",
      "nodes": [
        "node_modules/jest-circus"
      ],
      "fixAvailable": true
    },
    "jest-cli": {
      "name": "jest-cli",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@jest/core",
        "jest-config"
      ],
      "effects": [],
      "range": ">=25.1.0",
      "nodes": [
        "node_modules/jest-cli"
      ],
      "fixAvailable": true
    },
    "jest-config": {
      "name": "jest-config",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "babel-jest",
        "jest-circus",
        "jest-runner"
      ],
      "effects": [
        "jest-cli"
      ],
      "range": ">=25.1.0",
      "nodes": [
        "node_modules/jest-config"
      ],
      "fixAvailable": true
    },
    "jest-resolve-dependencies": {
      "name": "jest-resolve-dependencies",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "jest-snapshot"
      ],
      "effects": [],
      "range": ">=27.0.0-next.0",
      "nodes": [
        "node_modules/jest-resolve-dependencies"
      ],
      "fixAvailable": true
    },
    "jest-runner": {
      "name": "jest-runner",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@jest/transform",
        "jest-runtime"
      ],
      "effects": [
        "@jest/core",
        "jest-config"
      ],
      "range": ">=25.1.0",
      "nodes": [
        "node_modules/jest-runner"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "jest-runtime": {
      "name": "jest-runtime",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@jest/globals",
        "@jest/transform",
        "jest-snapshot"
      ],
      "effects": [
        "jest-circus",
        "jest-runner"
      ],
      "range": ">=25.1.0",
      "nodes": [
        "node_modules/jest-runtime"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "jest-snapshot": {
      "name": "jest-snapshot",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "@jest/transform"
      ],
      "effects": [
        "@jest/expect",
        "jest-circus",
        "jest-resolve-dependencies",
        "jest-runtime"
      ],
      "range": ">=27.0.0-next.0",
      "nodes": [
        "node_modules/jest-snapshot"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "js-yaml": {
      "name": "js-yaml",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        {
          "source": 1109754,
          "name": "js-yaml",
          "dependency": "js-yaml",
          "title": "js-yaml has prototype pollution in merge (<<)",
          "url": "https://github.com/advisories/GHSA-mh29-5h37-fv8m",
          "severity": "moderate",
          "cwe": [
            "CWE-1321"
          ],
          "cvss": {
            "score": 5.3,
            "vectorString": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N"
          },
          "range": "<4.1.1"
        }
      ],
      "effects": [
        "@istanbuljs/load-nyc-config"
      ],
      "range": "<4.1.1",
      "nodes": [
        "node_modules/js-yaml"
      ],
      "fixAvailable": {
        "name": "jest",
        "version": "25.0.0",
        "isSemVerMajor": true
      }
    },
    "live-server": {
      "name": "live-server",
      "severity": "high",
      "isDirect": true,
      "via": [
        "chokidar"
      ],
      "effects": [],
      "range": ">=1.2.1",
      "nodes": [
        "node_modules/live-server"
      ],
      "fixAvailable": {
        "name": "live-server",
        "version": "1.2.0",
        "isSemVerMajor": true
      }
    },
    "micromatch": {
      "name": "micromatch",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1098681,
          "name": "micromatch",
          "dependency": "micromatch",
          "title": "Regular Expression Denial of Service (ReDoS) in micromatch",
          "url": "https://github.com/advisories/GHSA-952p-6rrq-rcjv",
          "severity": "moderate",
          "cwe": [
            "CWE-1333"
          ],
          "cvss": {
            "score": 5.3,
            "vectorString": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L"
          },
          "range": "<4.0.8"
        },
        "braces"
      ],
      "effects": [
        "anymatch",
        "readdirp"
      ],
      "range": "<=4.0.7",
      "nodes": [
        "node_modules/chokidar/node_modules/micromatch",
        "node_modules/readdirp/node_modules/micromatch"
      ],
      "fixAvailable": {
        "name": "live-server",
        "version": "1.2.0",
        "isSemVerMajor": true
      }
    },
    "readdirp": {
      "name": "readdirp",
      "severity": "moderate",
      "isDirect": false,
      "via": [
        "micromatch"
      ],
      "effects": [
        "chokidar"
      ],
      "range": "2.2.0 - 2.2.1",
      "nodes": [
        "node_modules/readdirp"
      ],
      "fixAvailable": {
        "name": "live-server",
        "version": "1.2.0",
        "isSemVerMajor": true
      }
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 0,
      "moderate": 19,
      "high": 4,
      "critical": 0,
      "total": 23
    },
    "dependencies": {
      "prod": 1,
      "dev": 569,
      "optional": 31,
      "peer": 5,
      "peerOptional": 0,
      "total": 569
    }
  }
}
```
### Outdated Packages

```

```

---

**Generated by:** Tests & Documentation Workflow Automation v2.0.0
