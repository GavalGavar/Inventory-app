const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.js', 'utf8');

const old = '</div>\r\n              </div>\r\n            </div>\r\n          )}';
const newText = '</span>}\r\n              </div>\r\n            </div>\r\n          )}';
c = c.replace(old, newText);

fs.writeFileSync('src/app/admin/page.js', c, 'utf8');
console.log('Done:', c.includes('</span>}'));