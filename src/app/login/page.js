'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError('Invalid email or password.')
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  const inputStyle = {
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }

  return (
    <div
      className="p-10 flex items-center justify-center"
      style={{ background: 'var(--background)', minHeight: '100vh' }}
    >
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-xs">
        <h1
          className="text-xl font-medium tracking-wide pb-4 mb-2"
          style={{ color: 'var(--foreground)', borderBottom: '2px solid var(--accent)' }}
        >
          ADMIN LOGIN
        </h1>

        {error && <p className="text-xs" style={{ color: 'var(--soldout-text)' }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded text-sm"
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded text-sm"
          style={inputStyle}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="py-2 rounded text-sm font-medium disabled:opacity-50"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  )
}
