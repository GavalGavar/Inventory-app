const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.js', 'utf8');
const duplicate = `        <input
          type="text"
  placeholder="Хайх..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="p-2 rounded text-sm mb-6 w-full max-w-xs"
  style={{
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }}
/>`;
c = c.replace(duplicate, '');
fs.writeFileSync('src/app/admin/page.js', c, 'utf8');
console.log('Done!');
