const fs = require('fs');
let c = fs.readFileSync('src/app/admin/customers/page.js', 'utf8');
const lines = c.split('\n');

// Insert sorted and filtered before return statement (line 29, index 28)
const vars = [
  "  const sorted = [...customers].sort((a, b) => {\r",
  "    if (sortBy === 'total') return (b.totalSpent || 0) - (a.totalSpent || 0)\r",
  "    if (sortBy === 'orders') return (b.orderCount || 0) - (a.orderCount || 0)\r",
  "    return new Date(b.created_at) - new Date(a.created_at)\r",
  "  })\r",
  "  const filtered = sorted.filter(c =>\r",
  "    c.name?.toLowerCase().includes(search.toLowerCase()) ||\r",
  "    c.phone?.includes(search)\r",
  "  )\r",
  "\r"
];

lines.splice(28, 0, ...vars);
fs.writeFileSync('src/app/admin/customers/page.js', lines.join('\n'), 'utf8');
console.log('done:', lines.join('\n').includes('sorted'));
