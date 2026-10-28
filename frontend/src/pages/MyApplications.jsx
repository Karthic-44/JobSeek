import { Link } from 'react-router-dom'
import { useState } from 'react'
import api, { errorMessage } from '../api'
import { useLoad } from '../hooks'
import { useToast } from '../toast'
import { Button, Dialog, Empty, ErrorNote, Loading, Pager } from '../components/ui'
import { fullDate } from '../format'

export default function MyApplications() {
  const toast = useToast()
  const [page, setPage] = useState(0)
  const [withdrawing, setWithdrawing] = useState(null)
  const [busy, setBusy] = useState(false)

  const { data, loading, error, reload } = useLoad(
    () => api.get('/user/applications', { params: { pageNumber: page, pageSize: 8 } }).then((r) => r.data),
    [page],
  )

  async function withdraw() {
    setBusy(true)
    try {
      await api.delete(`/user/applications/${withdrawing.applicationId}`)
      toast('Application withdrawn')
      setWithdrawing(null)
      reload()
    } catch (err) {
      toast(errorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-5xl font-bold">My applications</h1>

      <div className="mt-8">
        {error ? (
          <ErrorNote onRetry={reload}>{error}</ErrorNote>
        ) : loading && !data ? (
          <Loading />
        ) : data.content.length === 0 ? (
          <Empty title="You haven’t applied to anything yet">
            <Link to="/" className="font-semibold text-ink underline underline-offset-4 hover:bg-mark">Browse the open jobs</Link>
            {' '}and your applications will be listed here.
          </Empty>
        ) : (
          <>
            <ul className="border-t-2 border-ink">
              {data.content.map((a) => (
                <li key={a.applicationId} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 border-b border-rule py-5">
                  <div>
                    <Link to={`/jobs/${a.jobId}`} className="text-xl font-bold underline-offset-4 hover:underline">
                      {a.jobName}
                    </Link>
                    <p>{a.company || 'Company not listed'}</p>
                    <p className="mt-1 text-ink-soft">
                      Applied {fullDate(a.appliedDate)}
                      {a.resumeURL && (
                        <>
                          {' '}with{' '}
                          <a href={a.resumeURL} target="_blank" rel="noreferrer noopener" className="font-semibold text-ink underline underline-offset-4 hover:bg-mark">
                            this resume
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => setWithdrawing(a)}>Withdraw</Button>
                </li>
              ))}
            </ul>
            <Pager page={data.pageNumber} totalPages={data.totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <Dialog open={!!withdrawing} onClose={() => setWithdrawing(null)} title="Withdraw this application?">
        <p>
          The recruiter at {withdrawing?.company || 'the company'} will no longer see your application for <b>{withdrawing?.jobName}</b>. You can apply again later.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="danger" onClick={withdraw} disabled={busy}>{busy ? 'Withdrawing' : 'Withdraw application'}</Button>
          <Button variant="ghost" onClick={() => setWithdrawing(null)}>Keep it</Button>
        </div>
      </Dialog>
    </div>
  )
}
