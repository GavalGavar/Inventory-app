const fs = require('fs');
let c = fs.readFileSync('src/app/products/page.js', 'utf8');
c = c.replace(
  "style={{ background: 'var(--background)', minHeight: '100vh' }}>",
  "style={{ background: 'var(--background)', minHeight: '100vh' }} onContextMenu={(e) => e.preventDefault()}><style>{`img { pointer-events: none; user-select: none; -webkit-user-drag: none; }`}</style>"
);
fs.writeFileSync('src/app/products/page.js', c, 'utf8');
console.log('done:', c.includes('onContextMenu'));