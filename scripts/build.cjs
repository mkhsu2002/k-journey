const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const name of ['index.html', 'version-a.html', 'version-b.html', 'version-c.html', 'assets']) {
  fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true });
}
console.log('Static site ready in dist/');
