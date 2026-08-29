const fs = require('fs');
let c = fs.readFileSync('src/app/admin/orders/page.js', 'utf8');
const lines = c.split('\n');

const idx = lines.findIndex((l, i) => i > 100 && l.includes('<OrderDeleteButton'));
console.log('found at:', idx + 1);

const loanBtn = `                    <button onClick={() => moveToLoan(order)} className="text-xs font-medium px-3 py-1 rounded" style={{ border: '0.5px solid var(--border)', color: '#f59e0b', background: 'var(--card)' }}>Зээл болгох</button>\r`;

lines.splice(idx, 0, loanBtn);
fs.writeFileSync('src/app/admin/orders/page.js', lines.join('\n'), 'utf8');
console.log('done:', lines.join('\n').includes('Зээл болгох'));
