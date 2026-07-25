const fs = require('fs');
let c = fs.readFileSync('src/components/NehemjlehReceipt.jsx', 'utf8');

// Find all empty spans in the left column and replace with receipt data
const lines = c.split('\n');
let leftCount = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(">&nbsp;</span>") && leftCount < 6) {
    leftCount++;
    if (leftCount === 2) lines[i] = lines[i].replace(">&nbsp;<", ">{receipt.branchEmail || ''}<");
    if (leftCount === 3) lines[i] = lines[i].replace(">&nbsp;<", ">{receipt.branchBankName || ''}<");
    if (leftCount === 4) lines[i] = lines[i].replace(">&nbsp;<", ">{receipt.branchBankAccount || ''}<");
  }
}
c = lines.join('\n');
fs.writeFileSync('src/components/NehemjlehReceipt.jsx', c, 'utf8');
console.log('done');