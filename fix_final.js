const fs = require('fs');
let c = fs.readFileSync('src/app/page.js', 'utf8');
c = c.replace(
  `const CEILING_SIZES = [
  { label: '30x30 Хөнгөн цагаан тааз', skuMin: 0.01, skuMax: 0.30 },
  { label: '30x60 Хөнгөн цагаан тааз', skuMin: 0.31, skuMax: 0.65 },
  { label: '60x60 Хөнгөн цагаан тааз', skuMin: 0.66, skuMax: 0.73 },
  { label: '45x90 Хөнгөн цагаан тааз', skuMin: 1.01, skuMax: 1.40 },
  { label: '60x120 Хөнгөн цагаан тааз', skuMin: 1.41, skuMax: 1.85 },
  { label: '1.22x2.44 Хөнгөн цагаан тааз', skuMin: 1.86, skuMax: 2.30 },
  { label: 'Нэмэлт материал', skuMin: 0.74, skuMax: 0.94 },
]`,
  `const CEILING_SIZES = [
  { label: '30x30 Хөнгөн цагаан тааз', keywords: ['30x30', '30х30'] },
  { label: '30x60 Хөнгөн цагаан тааз', keywords: ['30x60', '30х60'] },
  { label: '60x60 Хөнгөн цагаан тааз', keywords: ['60x60', '60х60'] },
  { label: '45x90 Хөнгөн цагаан тааз', keywords: ['45x90', '45х90'] },
  { label: '60x120 Хөнгөн цагаан тааз', keywords: ['60x120', '60х120', '120x60', '120х60'] },
  { label: '1.22x2.44 Хөнгөн цагаан тааз', keywords: ['1.22x2.44', '1.22х2.44', '122x244', '122х244'] },
  { label: 'Нэмэлт материал', isLeftover: true },
]`
);
c = c.replace(
  `      const size = CEILING_SIZES.find((s) => s.label === sizeFilter)
      if (size) {
        const skuNum = parseFloat(item.sku)
        matchesSize = !isNaN(skuNum) && skuNum >= size.skuMin && skuNum <= size.skuMax
      }`,
  `      const size = CEILING_SIZES.find((s) => s.label === sizeFilter)
      if (size) {
        if (size.isLeftover) {
          const otherKeywords = ['30x30','30х30','30x60','30х60','60x60','60х60','45x90','45х90','60x120','60х120','120x60','120х60','1.22x2.44','1.22х2.44','122x244','122х244']
          matchesSize = !otherKeywords.some((kw) => item.name.toLowerCase().includes(kw.toLowerCase()))
        } else {
          matchesSize = size.keywords.some((kw) => item.name.toLowerCase().includes(kw.toLowerCase()))
        }
      }`
);
fs.writeFileSync('src/app/page.js', c, 'utf8');
console.log('Done!');
