const fs = require('fs');
let c = fs.readFileSync('src/app/products/page.js', 'utf8');

// After addToCart, redirect to checkout
c = c.replace(
  "onClick={() => addToCart(item)}",
  "onClick={() => { addToCart(item); window.location.href = '/checkout'; }}"
);

fs.writeFileSync('src/app/products/page.js', c, 'utf8');
console.log('done:', c.includes('window.location.href'));
