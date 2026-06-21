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
      .filter((r) => r[0] && String(r[0]).trim() !== '')
      .map((r) => {
        const name = String(r[0]).trim()
        const discrepancy = Number(r[2]) || 0
        const quantity = Math.abs(discrepancy)
        const price = Number(r[3]) || 0
        return { name, quantity, price }
      })

    if (parsed.length === 0) {
      setError('No valid rows found. Make sure column A has item names.')
      return
    }

    const { data: existingItems, error: fetchError } = await supabase
      .from('items')
      .select('id, name, quantity, price')

    if (fetchError) {
      setError('Error checking existing items: ' + fetchError.message)
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
        .update({ quantity: row.quantity, price: row.price })
        .eq('id', row.existingId)
      if (updateError) {
        setError('Error updating ' + row.name + ': ' + updateError.message)
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
          image_url: null,
        }))
      )
      if (insertError) {
        setError('Error adding new items: ' + insertError.message)
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
            IMPORT FROM EXCEL
          </h1>
        </div>

        <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
          Upload an .xlsx file. Column A = item name, Column C = discrepancy (used as stock count), Column D = unit price.
        </p>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="p-2 rounded text-sm mb-6"
          style={cardStyle}
        />

        {error && (
          <p className="text-xs mb-4" style={{ color: 'var(--soldout-text)' }}>
            {error}
          </p>
        )}

        {done && (
          <p className="text-xs mb-4" style={{ color: 'var(--stock-text)' }}>
            Import complete! Items have been added/updated.
          </p>
        )}

        {rows.length > 0 && (
          <>
            <div className="mb-4 rounded overflow-hidden" style={cardStyle}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Old Qty</th>
                    <th className="text-left p-2">New Qty</th>
                    <th className="text-left p-2">Old Price</th>
                    <th className="text-left p-2">New Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '0.5px solid var(--border)' }}>
                      <td className="p-2" style={{ color: 'var(--foreground)' }}>{row.name}</td>
                      <td className="p-2">
                        <span
                          className="px-2 py-1 rounded"
                          style={{
                            background: row.isNew ? 'var(--stock-bg)' : 'var(--soldout-bg)',
                            color: row.isNew ? 'var(--stock-text)' : 'var(--soldout-text)',
                          }}
                        >
                          {row.isNew ? 'NEW' : 'UPDATE'}
                        </span>
                      </td>
                      <td className="p-2" style={{ color: 'var(--muted)' }}>{row.oldQuantity ?? '—'}</td>
                      <td className="p-2" style={{ color: 'var(--foreground)' }}>{row.quantity}</td>
                      <td className="p-2" style={{ color: 'var(--muted)' }}>{row.oldPrice ?? '—'}</td>
                      <td className="p-2" style={{ color: 'var(--foreground)' }}>{row.price}</td>
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
              {saving ? 'Saving...' : `Confirm Import (${rows.length} items)`}
            </button>
          </>
        )}
      </div>
    </RequireAuth>
  )
}
