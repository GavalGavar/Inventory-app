const fs = require('fs');
let c = fs.readFileSync('src/app/page.js', 'utf8');
c = c.replace(
  "    const matchesCategory = !categoryFilter || item.category_number === categoryFilter\n    let matchesSize = true\n    if (sizeFilter && categoryFilter === 1) {",
  "    let matchesCategory = !categoryFilter || item.category_number === categoryFilter\n    let matchesSize = true\n    if (sizeFilter && categoryFilter === 1) {\n      matchesCategory = true // SKU range handles filtering"
);
fs.writeFileSync('src/app/page.js', c, 'utf8');
console.log('Done!');
