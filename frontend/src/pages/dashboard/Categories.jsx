import { useState } from 'react'
import api, { errorMessage } from '../../api'
import { useLoad } from '../../hooks'
import { useToast } from '../../toast'
import { Button, Dialog, Empty, ErrorNote, Field, Loading, Pager } from '../../components/ui'

export default function Categories() {
  const toast = useToast()
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState(null) // null | 'new' | category
  const [name, setName] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  const { data, loading, error, reload } = useLoad(
    () => api.get('/public/categories', { params: { pageNumber: page, pageSize: 10, sortBy: 'categoryName', sortOrder: 'asc' } }).then((r) => r.data),
    [page],
  )

  function open(c) {
    setEditing(c)
    setName(c === 'new' ? '' : c.categoryName)
    setFormError('')
  }

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    setFormError('')
    try {
      if (editing === 'new') await api.post('/admin/categories', { categoryName: name.trim() })
      else await api.put(`/admin/categories/${editing.categoryId}`, { categoryName: name.trim() })
      toast(editing === 'new' ? 'Category added' : 'Category renamed')
      setEditing(null)
      reload()
    } catch (err) {
      setFormError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    setBusy(true)
    try {
      await api.delete(`/admin/categories/${deleting.categoryId}`)
      toast('Category deleted')
      setDeleting(null)
      if (data.content.length === 1 && page > 0) setPage(page - 1); else reload()
    } catch (err) {
      toast(errorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-md text-ink-soft">Categories group jobs on the home page.</p>
        <Button onClick={() => open('new')}>Add category</Button>
      </div>

      <div className="mt-6">
        {error ? (
          <ErrorNote onRetry={reload}>{error}</ErrorNote>
        ) : loading && !data ? (
          <Loading />
        ) : data.content.length === 0 ? (
          <Empty title="No categories yet">Add one, then pick it when you post a job.</Empty>
        ) : (
          <>
            <ul className="border-t-2 border-ink">
              {data.content.map((c) => (
                <li key={c.categoryId} className="flex items-center justify-between gap-4 border-b border-rule py-3">
                  <span className="text-lg font-bold">{c.categoryName}</span>
                  <span className="whitespace-nowrap">
                    <button onClick={() => open(c)} className="mr-4 cursor-pointer font-semibold underline underline-offset-4 hover:bg-mark">Rename</button>
                    <button onClick={() => setDeleting(c)} className="cursor-pointer font-semibold text-danger underline underline-offset-4 hover:bg-danger hover:text-panel">Delete</button>
                  </span>
                </li>
              ))}
            </ul>
            <Pager page={data.pageNumber} totalPages={data.totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <Dialog open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add category' : 'Rename category'}>
        <form onSubmit={save} className="space-y-4">
          {formError && <ErrorNote>{formError}</ErrorNote>}
          <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} minLength={2} required autoFocus />
          <div className="flex gap-3">
            <Button type="submit" disabled={busy}>{busy ? 'Saving' : 'Save'}</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} title="Delete this category?">
        <p>
          Deleting <b>{deleting?.categoryName}</b> also deletes every job filed under it, along with their applications.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="danger" onClick={remove} disabled={busy}>{busy ? 'Deleting' : 'Delete category'}</Button>
          <Button variant="ghost" onClick={() => setDeleting(null)}>Keep it</Button>
        </div>
      </Dialog>
    </div>
  )
}
