const fs = require('fs');
let c = fs.readFileSync('src/app/page.js', 'utf8');
// Fix encoding - replace garbled Mongolian with correct UTF-8
c = c.replace(/\{item\.quantity > 0 \? '.*?' : '.*?'\}(\s*<\/span>)/g, "{item.quantity > 0 ? '\u0411\u044d\u043b\u044d\u043d \u0431\u0430\u0440\u0430\u0430' : '\u0414\u0443\u0443\u0441\u0441\u0430\u043d'}$1");
c = c.replace(/\{item\.quantity\} .*?\u043b(\s*<\/p>)/g, "{item.price.toLocaleString()} MNT \u00b7 {item.quantity} \u04ae\u043b\u0434\u044d\u0433\u0434\u044d\u043b$1");
c = c.replace('<span\n                  className="text-base font-medium"\n                  style={{ color: item.quantity > 0 ? \'var(--accent)\' : \'var(--muted)\' }}\n                >\n                  {item.price.toLocaleString()} MNT\n                </span>\n                ', '');
fs.writeFileSync('src/app/page.js', c, 'utf8');
console.log('Done!');
