const fs = require('fs');
let c = fs.readFileSync('src/app/checkout/page.js', 'utf8');
const lines = c.split('\n');
const idx = lines.findIndex(l => l.includes('Зураг оруулах (заавал биш)'));
console.log('found at:', idx + 1);
fs.writeFileSync('src/app/checkout/page.js', lines.join('\n'), 'utf8');
console.log('done:', idx > -1);
