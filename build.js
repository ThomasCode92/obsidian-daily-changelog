import { build } from 'esbuild';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const buildPath = 'dist';
const entryPoint = 'src/main.ts';
const outputPath = join(buildPath, 'main.js');
const manifestPath = join(buildPath, 'manifest.json');

async function runBuild() {
  if (!existsSync(buildPath)) {
    mkdirSync(buildPath, { recursive: true });
  }

  await build({
    entryPoints: [entryPoint],
    bundle: true,
    external: ['obsidian'],
    outfile: outputPath,
    format: 'cjs',
    target: 'es2020',
  });

  copyFileSync('src/manifest.json', manifestPath);
  console.log('Build completed successfully.');
}

runBuild().catch((err) => {
  console.error(err);
  process.exit(1);
});
