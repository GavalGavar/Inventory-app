'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../../../lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import RequireAuth from '../../../../../components/RequireAuth'
import Link from 'next/link'

export default function EditCompany() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [name, setName] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadCompany() {
      const { data } = await supabase.from('companies').select().eq('id', id).single()
      if (data) {
        setName(data.name)
        setRegNumber(data.registration_number || '')
        setPhone(data.phone || '')
      }
      setLoading(false)
    }
    loadCompany()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    console.log('Saving:', { id, name, regNumber, phone })
    const { data, error } = await supabase
      .from('companies')
      .update({ name: name.trim(), registration_number: regNumber.trim() || null, phone: phone.trim() || null })
      .eq('id', id)
    setSaving(false)
    console.log('Result:', { data, error })
    if (error) { alert('Error: ' + JSON.stringify(error)) }
    else { router.push('/admin/companies') }
    
  }

  const inputStyle = { background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }

  if (loading) return (
    <RequireAuth allowedRoles={['admin']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      </div>
    </RequireAuth>
  )

  return (
    <RequireAuth allowedRoles={['admin']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div className="pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            Компани засах
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
          <input type="text" placeholder="Компанийн нэр" value={name} onChange={(e) => setName(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} required />
          <input type="text" placeholder="Регистрийн дугаар" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} />
          <input type="text" placeholder="Утасны дугаар" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} />
          <button type="submit" disabled={saving} className="py-2 rounded text-sm font-medium disabled:opacity-50" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
          <Link href="/admin/companies" className="text-xs text-center" style={{ color: 'var(--muted)' }}>← Буцах</Link>
        </form>
      </div>
    </RequireAuth>
  )
}