import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { errorMessage } from '../api'
import { useAuth } from '../auth'
import { useToast } from '../toast'
import { Button, ErrorNote, Field } from '../components/ui'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ username: '', email: '', password: '', kind: 'user' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: [form.kind],
      })
      toast('Account created. Sign in to continue.')
      navigate('/login')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Create an account</h1>
      <p className="mt-3 text-ink-soft">
        Already have one? <Link to="/login" className="font-semibold text-ink underline underline-offset-4 hover:bg-mark">Sign in</Link>.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        {error && <ErrorNote>{error}</ErrorNote>}

        <fieldset>
          <legend className="mb-1 font-semibold">I want to</legend>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['user', 'Find a job'],
              ['recruiter', 'Post jobs'],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-[3px] border-2 border-ink px-3 py-2 text-center font-semibold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 ${
                  form.kind === value ? 'bg-mark' : 'bg-panel hover:bg-mark/40'
                }`}
              >
                <input type="radio" name="kind" value={value} checked={form.kind === value} onChange={set('kind')} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Username" value={form.username} onChange={set('username')} minLength={3} maxLength={25} autoComplete="username" required />
        <Field label="Email" type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
        <Field label="Password" type="password" value={form.password} onChange={set('password')} minLength={6} maxLength={40} autoComplete="new-password" hint="At least 6 characters." required />
        <Button type="submit" disabled={busy}>{busy ? 'Creating account' : 'Create account'}</Button>
      </form>
    </div>
  )
}
