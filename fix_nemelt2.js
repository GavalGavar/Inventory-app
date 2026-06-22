const fs = require('fs');
let c = fs.readFileSync('src/app/page.js', 'utf8');
c = c.replace(
  `      const size = CEILING_SIZES.find((s) => s.label === sizeFilter)
      if (size) {
        matchesSize = size.keywords.some((kw) =>
          item.name.toLowerCase().includes(kw.toLowerCase())
        )
      }`,
  `      const size = CEILING_SIZES.find((s) => s.label === sizeFilter)
      if (size) {
        if (size.skuMin !== undefined) {
          const skuNum = parseFloat(item.sku)
          matchesSize = !isNaN(skuNum) && skuNum >= size.skuMin && skuNum <= size.skuMax
        } else {
          matchesSize = size.keywords.some((kw) =>
            item.name.toLowerCase().includes(kw.toLowerCase())
          )
        }
      }`
);
fs.writeFileSync('src/app/page.js', c, 'utf8');
console.log('Done!');
