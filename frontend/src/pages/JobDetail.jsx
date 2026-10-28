import { Link, useLocation, useParams } from 'react-router-dom'
import { useState } from 'react'
import api, { errorMessage } from '../api'
import { useAuth } from '../auth'
import { useLoad } from '../hooks'
import { useToast } from '../toast'
import { Button, ErrorNote, Field, Loading } from '../components/ui'
import { fullDate, splitSkills, timeAgo } from '../format'

function ApplyPanel({ job }) {
  const { user } = useAuth()
  const toast = useToast()
  const location = useLocation()
  const [resume, setResume] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  if (!user) {
    return (
      <div className="border-2 border-ink bg-panel p-5">
        <p className="text-xl font-bold">Apply for this job</p>
        <p className="mt-2 text-ink-soft">You need an account so the recruiter can see who applied.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to={`/login?next=${encodeURIComponent(location.pathname)}`}
            className="rounded-[3px] border-2 border-ink bg-ink px-4 py-2 font-semibold text-panel hover:bg-mark hover:text-ink"
          >
            Sign in
          </Link>
          <Link to="/register" className="px-1 py-2 font-semibold underline underline-offset-4 hover:bg-mark">
            Create account
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="border-2 border-ink bg-mark p-5">
        <p className="text-xl font-bold">Application sent</p>
        <p className="mt-2">The recruiter at {job.company || 'the company'} can see it now.</p>
        <Link to="/applications" className="mt-3 inline-block font-semibold underline underline-offset-4">
          View my applications
        </Link>
      </div>
    )
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await api.post('/user/applications', { jobId: job.jobId, resumeURL: resume.trim() || null })
      setDone(true)
      toast('Application sent')
    } catch (err) {
      toast(errorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="border-2 border-ink bg-panel p-5">
      <p className="text-xl font-bold">Apply for this job</p>
      <p className="mt-1 text-ink-soft">Applying as {user.username}.</p>
      <Field
        label="Link to your resume"
        type="url"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        placeholder="https://drive.google.com/…"
        hint="Optional. Make sure the link is open to anyone who has it."
        className="mt-4"
      />
      <Button type="submit" disabled={busy} className="mt-4 w-full">
        {busy ? 'Sending' : 'Send application'}
      </Button>
    </form>
  )
}

export default function JobDetail() {
  const { id } = useParams()
  const { data: job, loading, error, reload } = useLoad(() => api.get(`/public/jobs/${id}`).then((r) => r.data), [id])

  if (loading) return <Loading />
  if (error) {
    return (
      <div className="max-w-xl">
        <ErrorNote onRetry={reload}>{error}</ErrorNote>
        <Link to="/" className="mt-4 inline-block font-semibold underline underline-offset-4 hover:bg-mark">
          Back to all jobs
        </Link>
      </div>
    )
  }

  const skills = splitSkills(job.requiredSkill)
  const paragraphs = (job.description || '').split(/\n{1,}/).filter(Boolean)

  return (
    <article>
      <Link to="/" className="font-semibold underline underline-offset-4 hover:bg-mark">
        All jobs
      </Link>

      <div className="mt-6 grid gap-x-14 gap-y-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <h1 className="text-4xl font-bold sm:text-6xl">{job.jobName}</h1>
          <p className="mt-3 text-xl">
            {job.company || 'Company not listed'}
            {job.location && <span className="text-ink-soft">, {job.location}</span>}
          </p>

          <dl className="mt-8 grid gap-x-8 gap-y-4 border-y-2 border-ink py-5 sm:grid-cols-3">
            <div>
              <dt className="text-ink-soft">Pay</dt>
              <dd className="font-bold">{job.salary || 'Not stated'}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Category</dt>
              <dd className="font-bold">{job.categoryName || 'Uncategorised'}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Posted</dt>
              <dd className="font-bold" title={fullDate(job.postedAt)}>{timeAgo(job.postedAt) || 'Date not recorded'}</dd>
            </div>
          </dl>

          <section className="mt-8 max-w-[62ch]">
            <h2 className="text-2xl font-bold">About the job</h2>
            <div className="mt-3 space-y-4 leading-relaxed">
              {paragraphs.length ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p className="text-ink-soft">No description yet.</p>}
            </div>
          </section>

          {skills.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-bold">Skills they ask for</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <li key={s} className="border-2 border-ink px-2.5 py-0.5 font-medium">{s}</li>
                ))}
              </ul>
            </section>
          )}

          {job.requiredQualifications && (
            <section className="mt-8 max-w-[62ch]">
              <h2 className="text-2xl font-bold">Qualifications</h2>
              <p className="mt-3">{job.requiredQualifications}</p>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <ApplyPanel job={job} />
        </aside>
      </div>
    </article>
  )
}
