const fs = require('fs');
let c = fs.readFileSync('src/components/NehemjlehReceipt.jsx', 'utf8');
const lines = c.split('\n');

// Line 73 - NOAT value
lines[72] = "            <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right' }}>{addNoat ? Math.round(receipt.total * 0.1).toLocaleString() : ''}</td>\r";

// Line 77 - Niit dun value
lines[76] = "            <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>{addNoat ? Math.round(receipt.total * 1.1).toLocaleString() : receipt.total.toLocaleString()}</td>\r";

fs.writeFileSync('src/components/NehemjlehReceipt.jsx', lines.join('\n'), 'utf8');
console.log('done');