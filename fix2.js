const fs = require('fs');
let c = fs.readFileSync('src/app/admin/bulk/page.js', 'utf8');
c = c.replace('>Excel tatah<', '>⬇ Excel татах<');
c = c.replace('"loading..."', '"Уншиж байна..."');
c = c.replace('"Excel orulah"', '"⬆ Excel оруулах"');
fs.writeFileSync('src/app/admin/bulk/page.js', c, 'utf8');
console.log('done');
