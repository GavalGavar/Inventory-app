const fs = require('fs');
let c = fs.readFileSync('src/app/page.js', 'utf8');
c = c.replace(
  "const CEILING_SIZES = [\n  { label: '30x30 Хөнгөн цагаан тааз', keywords: ['30x30', '30х30'] },\n  { label: '30x60 Хөнгөн цагаан тааз', keywords: ['30x60', '30х60'] },\n  { label: '60x60 Хөнгөн цагаан тааз', keywords: ['60x60', '60х60'] },\n  { label: '45x90 Хөнгөн цагаан тааз', keywords: ['45x90', '45х90'] },\n  { label: '60x120 Хөнгөн цагаан тааз', keywords: ['60x120', '60х120', '120x60', '120х60'] },\n  { label: '1.22x2.44 Хөнгөн цагаан тааз', keywords: ['1.22x2.44', '1.22х2.44', '122x244', '122х244'] },\n  { label: 'Нэмэлт материал', skuMin: 0.74, skuMax: 0.94 },\n]",
  "const CEILING_SIZES = [\n  { label: '30x30 Хөнгөн цагаан тааз', skuMin: 0.01, skuMax: 0.30 },\n  { label: '30x60 Хөнгөн цагаан тааз', skuMin: 0.31, skuMax: 0.65 },\n  { label: '60x60 Хөнгөн цагаан тааз', skuMin: 0.66, skuMax: 0.73 },\n  { label: '45x90 Хөнгөн цагаан тааз', skuMin: 1.01, skuMax: 1.40 },\n  { label: '60x120 Хөнгөн цагаан тааз', skuMin: 1.41, skuMax: 1.85 },\n  { label: '1.22x2.44 Хөнгөн цагаан тааз', skuMin: 1.86, skuMax: 2.30 },\n  { label: 'Нэмэлт материал', skuMin: 0.74, skuMax: 0.94 },\n]"
);
fs.writeFileSync('src/app/page.js', c, 'utf8');
console.log('Done!');
