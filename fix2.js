const fs = require('fs');
let c = fs.readFileSync('src/app/products/page.js', 'utf8');

// Add zoom state
c = c.replace(
  'function ProductsInner() {',
  'function ProductsInner() {\n  const [zoomImg, setZoomImg] = useState(null);'
);

// Make images clickable - find the image tag
c = c.replace(
  'className="w-full aspect-square object-cover rounded mb-2"',
  'className="w-full aspect-square object-cover rounded mb-2" onClick={() => setZoomImg(item.image_url)} style={{ cursor: "zoom-in" }}'
);

fs.writeFileSync('src/app/products/page.js', c, 'utf8');
console.log('step1:', c.includes('zoomImg'));