const fs = require('fs');
let c = fs.readFileSync('src/app/page.js', 'utf8');

// Add Нэмэлт материал to CEILING_SIZES
c = c.replace(
  "  { label: '1.22x2.44 Хөнгөн цагаан тааз', keywords: ['1.22x2.44', '1.22х2.44', '122x244', '122х244'] },",
  "  { label: '1.22x2.44 Хөнгөн цагаан тааз', keywords: ['1.22x2.44', '1.22х2.44', '122x244', '122х244'] },\n  { label: 'Нэмэлт материал', skuMin: 0.74, skuMax: 0.94 },"
);

// Update filter logic to handle skuMin/skuMax
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
