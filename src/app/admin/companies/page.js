'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [name, setName] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  async function loadCompanies() {
    const { data } = await supabase.from('companies').select().order('name')
    if (data) setCompanies(data)
  }

  async function addCompany(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)

    const { error } = await supabase.from('companies').insert({
      name: name.trim(),
      registration_number: regNumber.trim() || null,
    })

    setSaving(false)

    if (error) {
      alert('Error adding company: ' + error.message)
    } else {
      setName('')
      setRegNumber('')
      loadCompanies()
    }
  }

  async function deleteCompany(id) {
    const confirmed = confirm('Delete this company?')
    if (!confirmed) return

    await supabase.from('companies').delete().eq('id', id)
    loadCompanies()
  }

  const inputStyle = {
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }


  
    return (
  <RequireAuth allowedRoles={['admin']}>

      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            COMPANIES
          </h1>
          <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>
            Back to Admin
          </Link>
        </div>

        <form onSubmit={addCompany} className="flex flex-col gap-3 mb-6 max-w-sm">
          <input
            type="text"
            placeholder="Company or branch name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Registration number (optional)"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            Add Company
          </button>
        </form>

        {companies.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>No companies added yet.</p>
        )}

        {companies.length > 0 && (
          <div className="flex flex-col gap-2 max-w-sm">
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex justify-between items-center rounded p-3"
                style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
              >
                <div>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>
                    {company.name}
                  </p>
                  {company.registration_number && (
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      Reg: {company.registration_number}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteCompany(company.id)}
                  className="text-xs"
                  style={{ color: 'var(--soldout-text)' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  )
}
