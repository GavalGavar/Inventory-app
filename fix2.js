const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.js', 'utf8');

const oldSqmCells = `<td style={{ border: '1px solid black', padding: '3px' }}></td>
                            <td style={{ border: '1px solid black', padding: '3px' }}></td>
                            <td style={{ border: '1px solid black', padding: '3px' }}></td>
                            <td style={{ border: '1px solid black', padding: '3px' }}></td>
                            <td style={{ border: '1px solid black', padding: '3px' }}></td>`;

const newSqmCells = `<td style={{ border: '1px solid black', padding: '3px' }}></td>
                            <td style={{ border: '1px solid black', padding: '3px' }}></td>
                            <td style={{ border: '1px solid black', padding: '3px' }}></td>
                            <td style={{ border: '1px solid black', padding: '3px' }}></td>
                            <td style={{ border: '1px solid black', padding: '3px' }}></td>
                            <td style={{ border: '1px solid black', padding: '3px' }}></td>`;

c = c.replace(oldSqmCells, newSqmCells);
fs.writeFileSync('src/app/admin/page.js', c, 'utf8');
console.log('done');