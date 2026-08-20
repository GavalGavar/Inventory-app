const fs = require('fs');
let c = fs.readFileSync('src/app/admin/orders/page.js', 'utf8');
const lines = c.split('\n');

// Add search input before line 93 (index 92)
const searchInput = '            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 rounded text-sm mb-2 w-full" style={{ background: "var(--card)", border: "0.5px solid var(--border)", color: "var(--foreground)" }} />\r';
lines.splice(92, 0, searchInput);

// Replace orders.map with filtered version (now at index 93)
lines[93] = lines[93].replace('{orders.map((order) => (', '{orders.filter(o => o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.customer_contact?.includes(search)).map((order) => (');

fs.writeFileSync('src/app/admin/orders/page.js', lines.join('\n'), 'utf8');
console.log('done:', lines[93].includes('filter'));
