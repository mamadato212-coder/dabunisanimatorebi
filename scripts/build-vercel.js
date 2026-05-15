import { cpSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Create Vercel output directories
const outputDir = join(root, '.vercel', 'output');
const staticDir = join(outputDir, 'static');
const funcDir = join(outputDir, 'functions', '__nitro.func');

mkdirSync(staticDir, { recursive: true });
mkdirSync(funcDir, { recursive: true });

// Copy client assets to static directory
const clientDir = join(root, 'dist', 'client');
if (existsSync(clientDir)) {
  cpSync(clientDir, staticDir, { recursive: true });
}

// Copy server to function directory
const serverDir = join(root, 'dist', 'server');
if (existsSync(serverDir)) {
  cpSync(serverDir, funcDir, { recursive: true });
}

// Create the serverless function wrapper
const handlerContent = `
export default async function handler(req, res) {
  try {
    const { default: server } = await import('./server.js');
    
    // Convert Node.js request to Web Request
    const url = new URL(req.url, \`http://\${req.headers.host}\`);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
    }
    
    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    });
    
    const response = await server.fetch(webRequest, {}, {});
    
    // Set response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    res.status(response.status);
    
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal Server Error');
  }
}
`;

writeFileSync(join(funcDir, 'index.js'), handlerContent);

// Create function config for Node.js runtime
const funcConfig = {
  runtime: 'nodejs20.x',
  handler: 'index.default',
  launcherType: 'Nodejs'
};
writeFileSync(join(funcDir, '.vc-config.json'), JSON.stringify(funcConfig, null, 2));

// Create Vercel output config with proper routing
const outputConfig = {
  version: 3,
  routes: [
    {
      src: '^/assets/(.*)$',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
      continue: true
    },
    {
      handle: 'filesystem'
    },
    {
      src: '/(.*)',
      dest: '/__nitro'
    }
  ]
};
writeFileSync(join(outputDir, 'config.json'), JSON.stringify(outputConfig, null, 2));

console.log('Vercel Build Output created successfully!');
console.log('- Static files:', staticDir);
console.log('- Serverless function:', funcDir);
