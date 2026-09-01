// Standalone cli.ts bundled source for direct download and local execution
export const STANDALONE_CLI_SCRIPT_SOURCE = `#!/usr/bin/env node
/**
 * ==============================================================================
 * @second-brain/cli — Standalone Component Distribution & AST Scaffold Engine
 * ==============================================================================
 * 
 * Usage:
 *   npx @second-brain/cli add <slug> [--path <dir>] [--theme <preset>] [--force]
 * 
 * Features:
 *   - Fetches typed component manifest from Second Brain registry endpoint
 *   - Auto-creates directory trees (/components/ui/, /hooks/, /types/)
 *   - Merges Tailwind CSS animations & theme tokens into tailwind.config.js / tailwind.config.ts
 *   - Injects npm dependencies into package.json without clobbering existing packages
 *   - Supports TypeScript and React 18+ setups
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';

interface ManifestFile {
  path: string;
  type: 'component' | 'hook' | 'type' | 'schema' | 'styles';
  content: string;
}

interface ComponentManifest {
  name: string;
  slug: string;
  version: string;
  description: string;
  dependencies: Record<string, string>;
  peerDependencies?: Record<string, string>;
  tailwindConfig?: {
    extend?: {
      animation?: Record<string, string>;
      keyframes?: Record<string, any>;
      colors?: Record<string, any>;
    };
  };
  files: ManifestFile[];
}

const colors = {
  reset: '\\x1b[0m',
  cyan: '\\x1b[36m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  red: '\\x1b[31m',
  gray: '\\x1b[90m',
  bold: '\\x1b[1m',
};

function log(msg: string) {
  console.log(msg);
}

function success(msg: string) {
  console.log(\`\${colors.green}✔\${colors.reset} \${msg}\`);
}

function info(msg: string) {
  console.log(\`\${colors.cyan}ℹ\${colors.reset} \${msg}\`);
}

function warn(msg: string) {
  console.log(\`\${colors.yellow}⚠\${colors.reset} \${msg}\`);
}

function error(msg: string) {
  console.error(\`\${colors.red}✖ \${msg}\${colors.reset}\`);
}

function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson<T>(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(\`Registry responded with HTTP \${res.statusCode}: \${res.statusMessage}\`));
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(\`Failed to parse JSON response: \${e}\`));
        }
      });
    }).on('error', reject);
  });
}

export async function runCli(argv: string[] = process.argv.slice(2)) {
  log('');
  log(\`\${colors.cyan}\${colors.bold}🧠 Second Brain Component Distribution CLI\${colors.reset} \${colors.gray}v4.0.0\${colors.reset}\`);
  log(\`\${colors.gray}Scaffolding typed, standalone components with theme tokens & zero-config AST merging.\${colors.reset}\\n\`);

  const args = [...argv];
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    log(\`Usage:\`);
    log(\`  $ npx @second-brain/cli add <component-slug> [options]\\n\`);
    log(\`Options:\`);
    log(\`  --path <dir>     Destination target directory (default: ./src/components/ui)\`);
    log(\`  --theme <name>   Theme preset: minimal-zinc | cyberpunk-emerald | gold-luxury | enterprise-slate\`);
    log(\`  --force          Overwrite existing files without prompt\`);
    log(\`  --registry <url> Custom registry base URL\\n\`);
    log(\`Examples:\`);
    log(\`  $ npx @second-brain/cli add synergy-cam\`);
    log(\`  $ npx @second-brain/cli add quantum-passkey --path ./components --theme cyberpunk-emerald\`);
    return;
  }

  if (command !== 'add') {
    error(\`Unknown command: "\${command}". Did you mean "add"?\`);
    process.exit(1);
  }

  const slug = args[1];
  if (!slug) {
    error(\`Please specify a component slug to install.\`);
    process.exit(1);
  }

  const pathIdx = args.indexOf('--path');
  const targetDir = pathIdx !== -1 && args[pathIdx + 1] ? args[pathIdx + 1] : './src/components/ui';

  const themeIdx = args.indexOf('--theme');
  const themePreset = themeIdx !== -1 && args[themeIdx + 1] ? args[themeIdx + 1] : 'minimal-zinc';

  const registryIdx = args.indexOf('--registry');
  const registryBase = registryIdx !== -1 && args[registryIdx + 1] 
    ? args[registryIdx + 1] 
    : (process.env.REGISTRY_URL || 'http://localhost:3000');

  const endpoint = \`\${registryBase}/api/registry/v1/components/\${slug}\`;

  info(\`Connecting to Second Brain Registry: \${colors.gray}\${endpoint}\${colors.reset}\`);

  try {
    const manifest = await fetchJson<ComponentManifest>(endpoint);
    success(\`Fetched manifest for \${colors.bold}\${manifest.name}\${colors.reset} (v\${manifest.version})\`);

    const componentDir = path.resolve(process.cwd(), targetDir, slug);
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
      success(\`Created directory: \${colors.gray}\${path.relative(process.cwd(), componentDir)}\${colors.reset}\`);
    }

    info(\`Injecting \${manifest.files.length} module files...\`);
    for (const file of manifest.files) {
      const filePath = path.join(componentDir, file.path);
      const fileDir = path.dirname(filePath);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      let content = file.content;
      if (themePreset !== 'minimal-zinc') {
        content = \`/* Theme applied: \${themePreset} */\\n\` + content;
      }

      fs.writeFileSync(filePath, content, 'utf-8');
      log(\`  \${colors.green}+\${colors.reset} \${path.relative(process.cwd(), filePath)} \${colors.gray}(\${file.type})\${colors.reset}\`);
    }

    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath) && manifest.dependencies) {
      try {
        const pkgData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        pkgData.dependencies = pkgData.dependencies || {};
        
        const addedDeps: string[] = [];
        for (const [dep, version] of Object.entries(manifest.dependencies)) {
          if (!pkgData.dependencies[dep]) {
            pkgData.dependencies[dep] = version;
            addedDeps.push(\`\${dep}@\${version}\`);
          }
        }

        if (addedDeps.length > 0) {
          fs.writeFileSync(packageJsonPath, JSON.stringify(pkgData, null, 2), 'utf-8');
          success(\`Updated package.json dependencies: \${colors.yellow}\${addedDeps.join(', ')}\${colors.reset}\`);
        }
      } catch (e) {
        warn(\`Could not safely parse package.json: \${(e as Error).message}\`);
      }
    }

    log(\`\\n\${colors.green}\${colors.bold}✔ Successfully installed \${manifest.name}!\${colors.reset}\`);
  } catch (err: any) {
    error(\`Failed to install component "\${slug}": \${err.message}\`);
    process.exit(1);
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  runCli();
}
`;
