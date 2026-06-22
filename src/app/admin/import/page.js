'use client'
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'

export default function ImportItems() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  async function handleFile(e) {
    setError('')
    setDone(false)
    const file = e.target.files[0]
    if (!file) return

    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 })

    const parsed = json
      .filter((r) => {
        const firstCell = String(r[0] || '').trim()
        const secondCell = String(r[1] || '').trim()
        // Skip group separator rows (like ── 30x30 ──) and empty rows
        if (firstCell.startsWith('──') || firstCell.startsWith('--')) return false
        if (!secondCell) return false
        return true
      })
      .map((r) => {
        const sku = String(r[0] || '').trim()
        const name = String(r[1] || '').trim()
        const discrepancy = Number(r[3]) || 0
        const quantity = Math.round(Math.abs(discrepancy))
        const price = Number(r[4]) || 0
        return { sku, name, quantity, price }
      })
      .filter((r) => r.name)

    if (parsed.length === 0) {
      setError('Хүчинтэй мөр олдсонгүй.')
      return
    }

    const { data: existingItems, error: fetchError } = await supabase
      .from('items')
      .select('id, name, quantity, price, sku')

    if (fetchError) {
      setError('Алдаа гарлаа: ' + fetchError.message)
      return
    }

    const existingByName = {}
    existingItems.forEach((item) => {
      existingByName[item.name.trim().toLowerCase()] = item
    })

    const preview = parsed.map((row) => {
      const match = existingByName[row.name.toLowerCase()]
      return {
        ...row,
        isNew: !match,
        oldQuantity: match ? match.quantity : null,
        oldPrice: match ? match.price : null,
        oldSku: match ? match.sku : null,
        existingId: match ? match.id : null,
      }
    })

    setRows(preview)
  }

  async function handleConfirm() {
    setSaving(true)
    setError('')

    const toUpdate = rows.filter((r) => !r.isNew)
    const toInsert = rows.filter((r) => r.isNew)

    for (const row of toUpdate) {
      const { error: updateError } = await supabase
        .from('items')
        .update({ quantity: row.quantity, price: row.price, sku: row.sku })
        .eq('id', row.existingId)
      if (updateError) {
        setError('Засахад алдаа гарлаа: ' + row.name + ': ' + updateError.message)
        setSaving(false)
        return
      }
    }

    if (toInsert.length > 0) {
      const { error: insertError } = await supabase.from('items').insert(
        toInsert.map((row) => ({
          name: row.name,
          quantity: row.quantity,
          price: row.price,
          sku: row.sku,
          image_url: null,
        }))
      )
      if (insertError) {
        setError('Нэмэхэд алдаа гарлаа: ' + insertError.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setDone(true)
    setRows([])
  }

  const cardStyle = {
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
  }

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div className="pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            ИМПОРТЛОХ
          </h1>
        </div>

        <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
          .xlsx файл оруулна уу. A багана = SKU, B багана = нэр, D багана = тоо ширхэг (зөрүү), E багана = нэгж үнэ.
        </p>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="p-2 rounded text-sm mb-6"
          style={cardStyle}
        />

        {error && (
          <p className="text-xs mb-4" style={{ color: 'var(--soldout-text)' }}>{error}</p>
        )}

        {done && (
          <p className="text-xs mb-4" style={{ color: 'var(--stock-text)' }}>
            Импорт амжилттай! Бараанууд нэмэгдлээ/шинэчлэгдлээ.
          </p>
        )}

        {rows.length > 0 && (
          <>
            <div className="mb-4 rounded overflow-hidden" style={cardStyle}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
                    <th className="text-left p-2">SKU</th>
                    <th className="text-left p-2">Нэр</th>
                    <th className="text-left p-2">Төлөв</th>
                    <th className="text-left p-2">Хуучин тоо</th>
                    <th className="text-left p-2">Шинэ тоо</th>
                    <th className="text-left p-2">Үнэ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '0.5px solid var(--border)' }}>
                      <td className="p-2" style={{ color: 'var(--muted)' }}>{row.sku}</td>
                      <td className="p-2" style={{ color: 'var(--foreground)' }}>{row.name}</td>
                      <td className="p-2">
                        <span
                          className="px-2 py-1 rounded"
                          style={{
                            background: row.isNew ? 'var(--stock-bg)' : 'var(--soldout-bg)',
                            color: row.isNew ? 'var(--stock-text)' : 'var(--soldout-text)',
                          }}
                        >
                          {row.isNew ? 'ШИНЭ' : 'ШИНЭЧЛЭХ'}
                        </span>
                      </td>
                      <td className="p-2" style={{ color: 'var(--muted)' }}>{row.oldQuantity ?? '—'}</td>
                      <td className="p-2" style={{ color: 'var(--foreground)' }}>{row.quantity}</td>
                      <td className="p-2" style={{ color: 'var(--foreground)' }}>{row.price.toLocaleString()} MNT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleConfirm}
              disabled={saving}
              className="py-2 px-4 rounded text-sm font-medium disabled:opacity-50"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            >
              {saving ? 'Хадгалж байна...' : `Импортлох (${rows.length} бараа)`}
            </button>
          </>
        )}
      </div>
    </RequireAuth>
  )
}

