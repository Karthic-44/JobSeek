import { useState } from 'react'
import api, { errorMessage } from '../../api'
import { useLoad } from '../../hooks'
import { useToast } from '../../toast'
import { Button, Dialog, Empty, ErrorNote, Field, Loading, Pager } from '../../components/ui'

export default function Recruiters() {
  const toast = useToast()
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const { data, loading, error, reload } = useLoad(
    () => api.get('/auth/recruiters', { params: { pageNumber: page } }).then((r) => r.data),
    [page],
  )

  async function add(e) {
    e.preventDefault()
    setBusy(true)
    setFormError('')
    try {
      await api.post('/auth/signup', { ...form, username: form.username.trim(), email: form.email.trim(), role: ['recruiter'] })
      toast('Recruiter account created')
      setOpen(false)
      setForm({ username: '', email: '', password: '' })
      reload()
    } catch (err) {
      setFormError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-md text-ink-soft">People who can post jobs and see applicants.</p>
        <Button onClick={() => { setOpen(true); setFormError('') }}>Add recruiter</Button>
      </div>

      <div className="mt-6">
        {error ? (
          <ErrorNote onRetry={reload}>{error}</ErrorNote>
        ) : loading && !data ? (
          <Loading />
        ) : data.content.length === 0 ? (
          <Empty title="No recruiters yet">Add one here, or let people choose “Post jobs” when they sign up.</Empty>
        ) : (
          <>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-y-2 border-ink">
                  <th className="py-2 pr-4 font-bold">Username</th>
                  <th className="py-2 font-bold">Email</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((r) => (
                  <tr key={r.userId} className="border-b border-rule">
                    <td className="py-3 pr-4 font-bold">{r.userName}</td>
                    <td className="py-3">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pager page={data.pageNumber} totalPages={data.totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Add recruiter">
        <form onSubmit={add} className="space-y-4">
          {formError && <ErrorNote>{formError}</ErrorNote>}
          <Field label="Username" value={form.username} onChange={set('username')} minLength={3} maxLength={25} required autoFocus />
          <Field label="Email" type="email" value={form.email} onChange={set('email')} required />
          <Field label="Temporary password" type="text" value={form.password} onChange={set('password')} minLength={6} maxLength={40} hint="Share it with them privately." required />
          <div className="flex gap-3">
            <Button type="submit" disabled={busy}>{busy ? 'Creating' : 'Create account'}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
