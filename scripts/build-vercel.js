import { cpSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Create Vercel output directories
const outputDir = join(root, '.vercel', 'output');
const funcDir = join(outputDir, 'functions', 'index.func');
const staticDir = join(outputDir, 'static');

mkdirSync(funcDir, { recursive: true });
mkdirSync(staticDir, { recursive: true });

// Copy client assets to static directory
cpSync(join(root, 'dist', 'client', 'assets'), join(staticDir, 'assets'), { recursive: true });

// Copy server files to function directory
cpSync(join(root, 'dist', 'server'), funcDir, { recursive: true });

// Create edge function entry point that wraps the server
const entryContent = `
import server from './server.js';

export default async function handler(request) {
  return server.fetch(request, {}, {});
}

export const config = {
  runtime: 'edge',
};
`;

writeFileSync(join(funcDir, 'index.js'), entryContent);

// Create function config
const funcConfig = {
  runtime: 'edge',
  entrypoint: 'index.js'
};
writeFileSync(join(funcDir, '.vc-config.json'), JSON.stringify(funcConfig, null, 2));

// Create Vercel output config
const outputConfig = {
  version: 3,
  routes: [
    {
      src: '/assets/(.*)',
      dest: '/assets/$1'
    },
    {
      src: '/(.*)',
      dest: '/index'
    }
  ]
};
writeFileSync(join(outputDir, 'config.json'), JSON.stringify(outputConfig, null, 2));

console.log('Vercel output created successfully!');
