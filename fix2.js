const fs = require('fs');
let c = fs.readFileSync('src/app/products/page.js', 'utf8');
const lines = c.split('\n');

const toggleBtn = "          <button onClick={() => setShowCategories(!showCategories)} style={{ background: 'var(--foreground)', color: 'var(--background)', border: '0.5px solid var(--border)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>{showCategories ? '\u25b2 \u0425\u0430\u0430\u0445' : '\u25bc \u0410\u043d\u0433\u0438\u043b\u0430\u043b'}</button>\r";

const openWrapper = "          {showCategories && <>\r";
const closeWrapper = "          </>}\r";

// Insert toggle button and open wrapper before line 163 (index 162)
lines.splice(162, 0, toggleBtn, openWrapper);

// Find the closing of the category section - after the categoryFilter conditional
// Find line with )} after the category buttons
let closingIdx = -1;
for (let i = 163; i < lines.length; i++) {
  if (lines[i].trim() === ')}' || lines[i].trim() === ')}\r') {
    closingIdx = i;
    break;
  }
}
console.log('closing at:', closingIdx + 1);

if (closingIdx > -1) {
  lines.splice(closingIdx + 1, 0, closeWrapper);
}

fs.writeFileSync('src/app/products/page.js', lines.join('\n'), 'utf8');
console.log('done');