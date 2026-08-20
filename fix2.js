const fs = require('fs');
let c = fs.readFileSync('src/app/admin/archive/page.js', 'utf8');
const lines = c.split('\n');

// Find orders.map line
const idx = lines.findIndex(l => l.includes('orders.map((order) => ('));
console.log('found at:', idx + 1);

if (idx > -1) {
  // Add state - find useState lines
  const stateIdx = lines.findIndex(l => l.includes('useState([])'));
  lines.splice(stateIdx + 1, 0, '  const [search, setSearch] = useState("");\r');

  // Add search input before orders.map
  const newIdx = lines.findIndex(l => l.includes('orders.map((order) => ('));
  const searchInput = '            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 rounded text-sm mb-2 w-full" style={{ background: "var(--card)", border: "0.5px solid var(--border)", color: "var(--foreground)" }} />\r';
  lines.splice(newIdx, 0, searchInput);

  // Replace orders.map with filtered version
  const mapIdx = lines.findIndex(l => l.includes('orders.map((order) => ('));
  lines[mapIdx] = lines[mapIdx].replace('orders.map((order) => (', 'orders.filter(o => o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.customer_contact?.includes(search)).map((order) => (');
}

fs.writeFileSync('src/app/admin/archive/page.js', lines.join('\n'), 'utf8');
console.log('done');
