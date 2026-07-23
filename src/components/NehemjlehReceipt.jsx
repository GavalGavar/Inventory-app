'use client'
export default function NehemjlehReceipt({ receipt, setReceipt }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.7rem', marginBottom: '8px' }}>
        <span>Sangiin saidiin 2017 ony 12 dugaar saryn<br/>5-ny odriin 347 toot tushaalaas havsralt</span>
      </div>
      <h2 style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', margin: '8px 0' }}>
        NEHEMJLEH No.{receipt.receiptNumber}
      </h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem' }}>
        <div style={{ width: '48%' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Nehemjlegch:</p>
          <p>Baiguullagiin ner: <input className="no-print" value={receipt.branch} onChange={(e) => setReceipt({...receipt, branch: e.target.value})} style={{ border: 'none', borderBottom: '1px solid black', outline: 'none', width: '150px' }} /></p>
          <p style={{ marginTop: '8px' }}>Haig: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '180px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Utas/Faks: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '150px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>E-shuudan: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '150px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Bankny ner: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '150px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Bankny dans: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '140px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Registriin No: <input className="no-print" value={receipt.branchReg || ''} onChange={(e) => setReceipt({...receipt, branchReg: e.target.value})} style={{ border: 'none', borderBottom: '1px solid black', outline: 'none', width: '120px' }} /></p>
        </div>
        <div style={{ width: '48%' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Tulegch:</p>
          <p>Baiguullagiin ner: <input className="no-print" value={receipt.buyerName} onChange={(e) => setReceipt({...receipt, buyerName: e.target.value})} style={{ border: 'none', borderBottom: '1px solid black', outline: 'none', width: '150px' }} /></p>
          <p style={{ marginTop: '8px' }}>Haig: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '180px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Gerenii No: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '155px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Nehemjilsen ognoo: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '100px' }}>{receipt.date?.getFullYear()}/{(receipt.date?.getMonth()||0)+1}/{receipt.date?.getDate()}</span></p>
          <p style={{ marginTop: '8px' }}>Tolgoor hiyh hugatsaa: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '80px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Registriin No: <input className="no-print" value={receipt.buyerReg || ''} onChange={(e) => setReceipt({...receipt, buyerReg: e.target.value})} style={{ border: 'none', borderBottom: '1px solid black', outline: 'none', width: '120px' }} /></p>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '8px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '25px' }}>No</th>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Guilgeenii utga</th>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '80px' }}>Too hemjee</th>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '80px' }}>Negjiiin une</th>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '80px' }}>Niit une</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>
                <span className="no-print" onClick={() => setReceipt({...receipt, items: receipt.items.filter((_, idx) => idx !== i)})} style={{ cursor: 'pointer', color: 'red', fontSize: '0.7rem', marginRight: '2px' }}>x</span>{i + 1}
              </td>
              <td style={{ border: '1px solid black', padding: '3px' }}>{item.name}</td>
              <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>
                <input value={item.qty} onChange={(e) => setReceipt({...receipt, items: receipt.items.map((it, idx) => idx === i ? {...it, qty: e.target.value} : it)})} style={{ width: '40px', border: 'none', outline: 'none', textAlign: 'center', fontSize: '0.75rem' }} /> {item.unit_type || 'sh'}
              </td>
              <td style={{ border: '1px solid black', padding: '3px', textAlign: 'right' }}>
                <input value={item.price} onChange={(e) => setReceipt({...receipt, items: receipt.items.map((it, idx) => idx === i ? {...it, price: e.target.value} : it)})} style={{ width: '60px', border: 'none', outline: 'none', textAlign: 'right', fontSize: '0.75rem' }} />
              </td>
              <td style={{ border: '1px solid black', padding: '3px', textAlign: 'right' }}>{(item.price * item.qty).toLocaleString()}</td>
            </tr>
          ))}
          {[...Array(Math.max(0, 10 - receipt.items.length))].map((_, i) => (
            <tr key={`e-${i}`}>
              <td style={{ border: '1px solid black', padding: '8px' }}></td>
              <td style={{ border: '1px solid black', padding: '8px' }}></td>
              <td style={{ border: '1px solid black', padding: '8px' }}></td>
              <td style={{ border: '1px solid black', padding: '8px' }}></td>
              <td style={{ border: '1px solid black', padding: '8px' }}></td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} style={{ border: '1px solid black', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>Dun</td>
            <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right' }}>{receipt.total.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={4} style={{ border: '1px solid black', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>NUAT</td>
            <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right' }}></td>
          </tr>
          <tr>
            <td colSpan={4} style={{ border: '1px solid black', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>Niit dun</td>
            <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>{receipt.total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '16px', fontSize: '0.8rem' }}>
        <p>Mongoliin dun <span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '300px' }}>&nbsp;</span></p>
        <p style={{ textAlign: 'center', marginTop: '4px' }}>(usgeer)</p>
        <p style={{ borderBottom: '1px dotted black', marginTop: '4px' }}>&nbsp;</p>
        <p style={{ textAlign: 'right' }}>bolno.</p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>(Tamga)</span>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: '8px' }}>Darga <span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '200px' }}>&nbsp;</span>/<span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '100px' }}>&nbsp;</span>/</p>
            <p style={{ marginBottom: '8px' }}>Huleeen avsan <span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '175px' }}>&nbsp;</span>/<span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '100px' }}>&nbsp;</span>/</p>
            <p>Niagtlan bodogch <span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '165px' }}>&nbsp;</span>/<span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '100px' }}>&nbsp;</span>/</p>
          </div>
        </div>
      </div>
    </div>
  )
}