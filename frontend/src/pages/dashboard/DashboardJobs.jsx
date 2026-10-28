import { Link } from 'react-router-dom'
import { useState } from 'react'
import api, { errorMessage } from '../../api'
import { useLoad } from '../../hooks'
import { useToast } from '../../toast'
import { Button, Dialog, Empty, ErrorNote, Field, Loading, Pager } from '../../components/ui'
import { timeAgo } from '../../format'

const blank = {
  jobName: '', company: '', location: '', salary: '', role: '', categoryId: '',
  requiredSkill: '', requiredQualifications: '', description: '',
}

function JobForm({ job, categories, onSaved, onCancel }) {
  const toast = useToast()
  const [form, setForm] = useState(job ? { ...blank, ...job, categoryId: job.categoryId ?? '' } : blank)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const body = { ...form, categoryId: form.categoryId ? Number(form.categoryId) : null }
    try {
      if (job) await api.put(`/recruiter/job/${job.jobId}`, body)
      else await api.post('/recruiter/job', body)
      toast(job ? 'Job updated' : 'Job posted')
      onSaved()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorNote>{error}</ErrorNote>}
      <Field label="Job title" value={form.jobName} onChange={set('jobName')} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" value={form.company} onChange={set('company')} />
        <Field label="Location" value={form.location} onChange={set('location')} placeholder="City, or Remote" />
        <Field label="Pay" value={form.salary} onChange={set('salary')} placeholder="₹8–12 LPA" />
        <Field label="Category" as="select" value={form.categoryId} onChange={set('categoryId')}>
          <option value="">No category</option>
          {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
        </Field>
      </div>
      <Field label="Job type" value={form.role} onChange={set('role')} placeholder="Software Engineer" />
      <Field label="Skills" value={form.requiredSkill} onChange={set('requiredSkill')} hint="Separate with commas: Java, SQL, Excel" />
      <Field label="Qualifications" value={form.requiredQualifications} onChange={set('requiredQualifications')} />
      <Field label="Description" as="textarea" value={form.description} onChange={set('description')} hint="Blank lines start a new paragraph." />
      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={busy}>{busy ? 'Saving' : job ? 'Save changes' : 'Post job'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

export default function DashboardJobs() {
  const toast = useToast()
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState(null) // null | 'new' | job
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const jobs = useLoad(
    () => api.get('/public/jobs', { params: { pageNumber: page, pageSize: 10, sortBy: 'jobId', sortOrder: 'desc' } }).then((r) => r.data),
    [page],
  )
  const categories = useLoad(
    () => api.get('/public/categories', { params: { pageSize: 100, sortBy: 'categoryName', sortOrder: 'asc' } }).then((r) => r.data.content),
    [],
  )

  async function remove() {
    setBusy(true)
    try {
      await api.delete(`/recruiter/job/${deleting.jobId}`)
      toast('Job deleted')
      setDeleting(null)
      jobs.reload()
    } catch (err) {
      toast(errorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-lg text-ink-soft">Every job on the site. Open a job’s applicants to see who applied.</p>
        <Button onClick={() => setEditing('new')}>Post a job</Button>
      </div>

      <div className="mt-6">
        {jobs.error ? (
          <ErrorNote onRetry={jobs.reload}>{jobs.error}</ErrorNote>
        ) : jobs.loading && !jobs.data ? (
          <Loading />
        ) : jobs.data.content.length === 0 ? (
          <Empty title="No jobs posted yet">Use “Post a job” to add the first one.</Empty>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <thead>
                  <tr className="border-y-2 border-ink">
                    <th className="py-2 pr-4 font-bold">Job</th>
                    <th className="py-2 pr-4 font-bold">Category</th>
                    <th className="py-2 pr-4 font-bold">Posted</th>
                    <th className="py-2 text-right font-bold"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.data.content.map((j) => (
                    <tr key={j.jobId} className="border-b border-rule align-top">
                      <td className="py-3 pr-4">
                        <Link to={`/jobs/${j.jobId}`} className="font-bold underline-offset-4 hover:underline">{j.jobName}</Link>
                        <div className="text-ink-soft">{j.company || 'Company not listed'}</div>
                      </td>
                      <td className="py-3 pr-4">{j.categoryName || <span className="text-ink-soft">None</span>}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{timeAgo(j.postedAt) || <span className="text-ink-soft">Not recorded</span>}</td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <Link to={`/dashboard/jobs/${j.jobId}/applicants`} className="mr-4 font-semibold underline underline-offset-4 hover:bg-mark">Applicants</Link>
                        <button onClick={() => setEditing(j)} className="mr-4 cursor-pointer font-semibold underline underline-offset-4 hover:bg-mark">Edit</button>
                        <button onClick={() => setDeleting(j)} className="cursor-pointer font-semibold text-danger underline underline-offset-4 hover:bg-danger hover:text-panel">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={jobs.data.pageNumber} totalPages={jobs.data.totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <Dialog wide open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Post a job' : 'Edit job'}>
        <JobForm
          job={editing === 'new' ? null : editing}
          categories={categories.data || []}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); jobs.reload() }}
        />
      </Dialog>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} title="Delete this job?">
        <p><b>{deleting?.jobName}</b> and every application sent to it will be removed. This can’t be undone.</p>
        <div className="mt-6 flex gap-3">
          <Button variant="danger" onClick={remove} disabled={busy}>{busy ? 'Deleting' : 'Delete job'}</Button>
          <Button variant="ghost" onClick={() => setDeleting(null)}>Keep job</Button>
        </div>
      </Dialog>
    </div>
  )
}
