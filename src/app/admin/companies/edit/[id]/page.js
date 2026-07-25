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
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadCompany() {
      const { data } = await supabase.from('companies').select().eq('id', id).single()
      if (data) {
        setName(data.name)
        setRegNumber(data.registration_number || '')
        setPhone(data.phone || '')
        setAddress(data.address || '')
        setEmail(data.email || '')
        setBankName(data.bank_name || '')
        setBankAccount(data.bank_account || '')
      }
      setLoading(false)
    }
    loadCompany()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('companies')
      .update({
        name: name.trim(),
        registration_number: regNumber.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        email: email.trim() || null,
        bank_name: bankName.trim() || null,
        bank_account: bankAccount.trim() || null,
      })
      .eq('id', id)
    setSaving(false)
    if (error) { alert('Error: ' + error.message) }
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
          <input type="text" placeholder="Хаяг" value={address} onChange={(e) => setAddress(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} />
          <input type="text" placeholder="Э-шуудан" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} />
          <input type="text" placeholder="Банкны нэр" value={bankName} onChange={(e) => setBankName(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} />
          <input type="text" placeholder="Банкны дансны дугаар" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} />
          <button type="submit" disabled={saving} className="py-2 rounded text-sm font-medium disabled:opacity-50" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
          <Link href="/admin/companies" className="text-xs text-center" style={{ color: 'var(--muted)' }}>← Буцах</Link>
        </form>
      </div>
    </RequireAuth>
  )
}