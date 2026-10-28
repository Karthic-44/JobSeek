import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { errorMessage } from '../api'
import { useAuth } from '../auth'
import { useToast } from '../toast'
import { Button, ErrorNote, Field } from '../components/ui'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const next = params.get('next')
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={safeNext} replace />

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const u = await login(username.trim(), password)
      toast(`Welcome back, ${u.username}`)
      navigate(safeNext, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Sign in</h1>
      <p className="mt-3 text-ink-soft">
        New here? <Link to="/register" className="font-semibold text-ink underline underline-offset-4 hover:bg-mark">Create an account</Link>.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        {error && <ErrorNote>{error}</ErrorNote>}
        <Field label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required autoFocus />
        <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        <Button type="submit" disabled={busy}>{busy ? 'Signing in' : 'Sign in'}</Button>
      </form>
    </div>
  )
}
