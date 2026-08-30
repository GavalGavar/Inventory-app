const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.js', 'utf8');
const lines = c.split('\n');

const startIdx = lines.findIndex(l => l.includes('{(() => {') && lines[lines.indexOf(l)+1]?.includes('sqmRows'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === '})()}');
console.log('section:', startIdx+1, 'to', endIdx+1);

const newSection = [
  "                      {(() => {\r",
  "                        const sqmRows = receipt.sqmRows || calcSqmRows(receipt.items)\r",
  "                        const sizes = []\r",
  "                        sqmRows.forEach(row => {\r",
  "                          if (row.symbol.includes('\u25A1')) {\r",
  "                            sizes.push({ name: row.symbol.replace(' \u25A1',''), rows: [row.symbol.split(' ').pop()+'-'+row.qty+'\u0448'] })\r",
  "                          } else if (sizes.length > 0) {\r",
  "                            sizes[sizes.length-1].rows.push(row.symbol.split(' ').pop()+'-'+row.qty+'\u0448')\r",
  "                          }\r",
  "                        })\r",
  "                        const maxRows = Math.max(...sizes.map(s => s.rows.length), 0)\r",
  "                        const startRow = Math.max(receipt.items.length, 16) + 1\r",
  "                        return Array.from({ length: maxRows }, (_, ri) => (\r",
  "                          <tr key={'s'+ri}>\r",
  "                            <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{startRow + ri}</td>\r",
  "                            <td style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold' }}>{ri===0&&sizes[0]?<><b>{sizes[0].name}</b> </>:''}{sizes[0]?.rows[ri]}</td>\r",
  "                            <td style={{ border: '1px solid black', padding: '3px' }}></td>\r",
  "                            <td style={{ border: '1px solid black', padding: '3px' }}></td>\r",
  "                            <td style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold' }}>{ri===0&&sizes[1]?<><b>{sizes[1].name}</b> </>:''}{sizes[1]?.rows[ri]}</td>\r",
  "                            <td style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold' }}>{ri===0&&sizes[2]?<><b>{sizes[2].name}</b> </>:''}{sizes[2]?.rows[ri]}</td>\r",
  "                            <td style={{ border: '1px solid black', padding: '3px' }}></td>\r",
  "                          </tr>\r",
  "                        ))\r",
  "                      })()}\r"
];

lines.splice(startIdx, endIdx - startIdx + 1, ...newSection);
fs.writeFileSync('src/app/admin/page.js', lines.join('\n'), 'utf8');
console.log('done:', lines.join('\n').includes("sizes[1]?.rows[ri]"));
