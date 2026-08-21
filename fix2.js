const fs = require('fs');
let c = fs.readFileSync('src/app/products/page.js', 'utf8');
c = c.replace(
  '<style>{`img { pointer-events: none; user-select: none; -webkit-user-drag: none; }`}</style>',
  '<style>{`img { user-select: none; -webkit-user-drag: none; }`}</style>'
);
fs.writeFileSync('src/app/products/page.js', c, 'utf8');
console.log('done:', c.includes('pointer-events: none') ? 'still has it' : 'removed');