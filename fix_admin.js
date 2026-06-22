const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.js', 'utf8');
const select = `        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 rounded text-sm mb-4 mr-3"
          style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option value="">Бүх ангилал</option>
          <option value="1">1. Хөнгөн цагаан тааз</option>
          <option value="2">2. Гэрэл сэнс</option>
          <option value="3">3. Ханын панел хавтан</option>
          <option value="4">4. Хулсан хавтан</option>
          <option value="5">5. Ханын гоёлын рейк</option>
          <option value="6">6. Таазны рейк</option>
          <option value="7">7. Плинтүс</option>
          <option value="8">8. Хавтан таазны хүрээ</option>
          <option value="9">9. Гипсэн тааз</option>
          <option value="10">10. Сараалжин тааз</option>
          <option value="11">11. Чулуун емульс</option>
          <option value="12">12. TOR pinturas</option>
          <option value="13">13. Бусад бараа</option>
        </select>
`;
c = c.replace('        <input\n          type="text"', select + '        <input\n          type="text"');
fs.writeFileSync('src/app/admin/page.js', c, 'utf8');
console.log('Done!');
