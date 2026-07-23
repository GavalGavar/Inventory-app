const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.js', 'utf8');

content = content.replace(
  "import Link from 'next/link'",
  "import Link from 'next/link'\nimport NehemjlehReceipt from '../../components/NehemjlehReceipt'"
);

content = content.replace(
  'const [preview, setPreview] = useState(null)',
  'const [preview, setPreview] = useState(null)\n  const [receiptType, setReceiptType] = useState("zarlagiin")'
);

const old1 = '                <div className="no-print flex gap-3 mb-4">';
const new1 = '                <div className="no-print flex gap-2 mb-3"><button onClick={() => setReceiptType("zarlagiin")} style={{ background: receiptType === "zarlagiin" ? "#e81c1c" : "#eee", color: receiptType === "zarlagiin" ? "#fff" : "#111", padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer", marginRight: "8px" }}>Zarlagiin</button><button onClick={() => setReceiptType("nehemjleh")} style={{ background: receiptType === "nehemjleh" ? "#e81c1c" : "#eee", color: receiptType === "nehemjleh" ? "#fff" : "#111", padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer" }}>Nehemjleh</button></div>\n' + old1;
content = content.replace(old1, new1);

const old2 = '<div id="receipt-print" style={{ fontFamily: "Arial, sans-serif", color: "black", fontSize: "0.8rem" }}>';
const new2 = '<div id="receipt-print" style={{ fontFamily: "Arial, sans-serif", color: "black", fontSize: "0.8rem" }}>{receiptType === "nehemjleh" ? <NehemjlehReceipt receipt={receipt} setReceipt={setReceipt} /> : <span>';
content = content.replace(old2, new2);

content = content.replace(
  '</div>\n              </div>\n            </div>\n          )}',
  '</span>}\n              </div>\n            </div>\n          )}'
);

fs.writeFileSync('src/app/admin/page.js', content, 'utf8');
console.log('Done! Changes:', content.includes('NehemjlehReceipt'));
