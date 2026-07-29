const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.js', 'utf8');
const lines = c.split('\n');
lines[429] = lines[429].replace('NOAT {addNoat ? "ON" : "OFF"}', '\u041d\u04e8\u0410\u0422 {addNoat ? "ON" : "OFF"}');
fs.writeFileSync('src/app/admin/page.js', lines.join('\n'), 'utf8');
console.log('done:', lines[429].includes('\u041d\u04e8\u0410\u0422'));