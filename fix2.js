const fs = require('fs');
let c = fs.readFileSync('src/app/admin/orders/page.js', 'utf8');
const lines = c.split('\n');

// Find where customer contact is displayed
const idx = lines.findIndex(l => l.includes('customer_contact'));
console.log('found at:', idx + 1);

// Add photo display after customer contact
lines.splice(idx + 1, 0, "                    {order.photo_url && <img src={order.photo_url} alt=\"customer photo\" style={{ width: '100%', maxWidth: '200px', borderRadius: '6px', marginTop: '8px', cursor: 'pointer' }} onClick={() => window.open(order.photo_url, '_blank')} />}\r");

fs.writeFileSync('src/app/admin/orders/page.js', lines.join('\n'), 'utf8');
console.log('done:', lines.join('\n').includes('photo_url'));
