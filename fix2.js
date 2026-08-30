const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.js', 'utf8');
const lines = c.split('\n');

// Find start and end of calcSqmRows function
const startIdx = lines.findIndex(l => l.includes('function calcSqmRows'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l === '}');
console.log('function lines:', startIdx + 1, 'to', endIdx + 1);

// Replace with new function that separates by size
const newFn = [
  "function calcSqmRows(orderItems) {\r",
  "  const groups = {}\r",
  "  orderItems.filter(i => i.unit_type === 'm.kv' || i.unit_type === '\u043c.\u043a\u0432').forEach(item => {\r",
  "    const qty = Number(item.qty)\r",
  "    const name = item.name.toLowerCase()\r",
  "    let size = null, square = 0, t = 0, l = 0, x = 0\r",
  "    if (name.includes('30x30') || name.includes('30\u044530')) {\r",
  "      size = '30x30'; square = Math.ceil(qty / 0.09); t = Math.ceil(qty); x = t * 3\r",
  "    } else if (name.includes('30x60') || name.includes('30\u044560')) {\r",
  "      size = '30x60'; square = Math.ceil(qty / 0.18); t = Math.ceil(qty * 0.54); l = Math.ceil(qty * 0.2); x = t * 3\r",
  "    } else if (name.includes('60x60') || name.includes('60\u044560')) {\r",
  "      size = '60x60'; square = Math.ceil(qty / 0.36); t = Math.ceil(qty * 0.54); l = Math.ceil(qty * 0.2); x = t * 3\r",
  "    }\r",
  "    if (size) {\r",
  "      if (!groups[size]) groups[size] = { square: 0, t: 0, l: 0, x: 0 }\r",
  "      groups[size].square += square\r",
  "      groups[size].t += t\r",
  "      groups[size].l += l\r",
  "      groups[size].x += x\r",
  "    }\r",
  "  })\r",
  "  const rows = []\r",
  "  Object.entries(groups).forEach(([size, vals]) => {\r",
  "    rows.push({ symbol: size + ' \u25A1', qty: vals.square })\r",
  "    rows.push({ symbol: size + ' T', qty: vals.t })\r",
  "    if (vals.l > 0) rows.push({ symbol: size + ' L', qty: vals.l })\r",
  "    rows.push({ symbol: size + ' X', qty: vals.x })\r",
  "  })\r",
  "  return rows\r",
  "}\r"
];

lines.splice(startIdx, endIdx - startIdx + 1, ...newFn);
fs.writeFileSync('src/app/admin/page.js', lines.join('\n'), 'utf8');
console.log('done:', lines.join('\n').includes('groups[size]'));
