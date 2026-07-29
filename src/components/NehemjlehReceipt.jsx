'use client'
export default function NehemjlehReceipt({ receipt, setReceipt, addNoat }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.7rem', marginBottom: '8px' }}>
        <span>Сангийн сайдын 2017 оны 12 дугаар сарын<br/>5-ны өдрийн 347 тоот тушаалын хавсралт</span>
      </div>
      <h2 style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', margin: '8px 0' }}>
        НЭХЭМЖЛЭХ №{receipt.receiptNumber}
      </h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem' }}>
        <div style={{ width: '48%' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Нэхэмжлэгч::</p>
          <p>Байгууллагын нэр: <input className="no-print" value={receipt.branch} onChange={(e) => setReceipt({...receipt, branch: e.target.value})} style={{ border: 'none', borderBottom: '1px solid black', outline: 'none', width: '150px' }} /></p>
          <p style={{ marginTop: '8px' }}>Хаяг: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '180px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Утас/Факс: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '150px' }}>{receipt.branchEmail || ''}</span></p>
          <p style={{ marginTop: '8px' }}>Э_шуудан: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '150px' }}>{receipt.branchBankName || ''}</span></p>
          <p style={{ marginTop: '8px' }}>Банкны нэр: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '150px' }}>{receipt.branchBankAccount || ''}</span></p>
          <p style={{ marginTop: '8px' }}>Банкны дансны дугаар: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '140px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Регистрийн №: <input className="no-print" value={receipt.branchReg || ''} onChange={(e) => setReceipt({...receipt, branchReg: e.target.value})} style={{ border: 'none', borderBottom: '1px solid black', outline: 'none', width: '120px' }} /></p>
        </div>
        <div style={{ width: '48%' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Төлөгч:</p>
          <p>Байгууллагын нэр: <input className="no-print" value={receipt.buyerName} onChange={(e) => setReceipt({...receipt, buyerName: e.target.value})} style={{ border: 'none', borderBottom: '1px solid black', outline: 'none', width: '150px' }} /></p>
          <p style={{ marginTop: '8px' }}>Хаяг: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '180px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Гэрээний №: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '155px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Нэхэмжилсэн огноо: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '100px' }}>{receipt.date?.getFullYear()}/{(receipt.date?.getMonth()||0)+1}/{receipt.date?.getDate()}</span></p>
          <p style={{ marginTop: '8px' }}>Төлбөр хийх хугацаа: <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '80px' }}>&nbsp;</span></p>
          <p style={{ marginTop: '8px' }}>Регистрийн №: <input className="no-print" value={receipt.buyerReg || ''} onChange={(e) => setReceipt({...receipt, buyerReg: e.target.value})} style={{ border: 'none', borderBottom: '1px solid black', outline: 'none', width: '120px' }} /></p>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '8px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '25px' }}>No</th>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Гүйлгээний утга</th>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '80px' }}>Тоо хэмжээ</th>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '80px' }}>Нэгжийн үнэ</th>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '80px' }}>Нийт үнэ</th>
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
            <td colSpan={4} style={{ border: '1px solid black', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>Дүн</td>
            <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right' }}>{receipt.total.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={4} style={{ border: '1px solid black', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>НӨАТ</td>
            <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right' }}>{addNoat ? Math.round(receipt.total * 0.1).toLocaleString() : ''}</td>
          </tr>
          <tr>
            <td colSpan={4} style={{ border: '1px solid black', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>Нийт дүн</td>
            <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>{addNoat ? Math.round(receipt.total * 1.1).toLocaleString() : receipt.total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '16px', fontSize: '0.8rem' }}>
        <p>Мөнгөний дүн <span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '300px' }}>&nbsp;</span></p>
        <p style={{ textAlign: 'center', marginTop: '4px' }}>(үсгээр)</p>
        <p style={{ borderBottom: '1px dotted black', marginTop: '4px' }}>&nbsp;</p>
        <p style={{ textAlign: 'right' }}>болно.</p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>(Тамга)</span>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: '8px' }}>Дарга <span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '200px' }}>&nbsp;</span>/<span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '100px' }}>&nbsp;</span>/</p>
            <p style={{ marginBottom: '8px' }}>Хүлээн авсан <span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '175px' }}>&nbsp;</span>/<span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '100px' }}>&nbsp;</span>/</p>
            <p>Нягтлан бодогч <span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '165px' }}>&nbsp;</span>/<span style={{ borderBottom: '1px dotted black', display: 'inline-block', width: '100px' }}>&nbsp;</span>/</p>
          </div>
        </div>
      </div>
    </div>
  )
}