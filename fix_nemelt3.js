const fs = require('fs');
let c = fs.readFileSync('src/app/page.js', 'utf8');
c = c.replace(
  "        matchesSize = size.keywords.some((kw) =>\n          item.name.toLowerCase().includes(kw.toLowerCase())\n        )",
  "        if (size.skuMin !== undefined) {\n          const skuNum = parseFloat(item.sku)\n          matchesSize = !isNaN(skuNum) && skuNum >= size.skuMin && skuNum <= size.skuMax\n        } else {\n          matchesSize = size.keywords.some((kw) =>\n            item.name.toLowerCase().includes(kw.toLowerCase())\n          )\n        }"
);
fs.writeFileSync('src/app/page.js', c, 'utf8');
console.log('Done!');
