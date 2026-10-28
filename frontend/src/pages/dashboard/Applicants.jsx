import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import api from '../../api'
import { useLoad } from '../../hooks'
import { Empty, ErrorNote, Loading, Pager } from '../../components/ui'
import { fullDate } from '../../format'

export default function Applicants() {
  const { id } = useParams()
  const [page, setPage] = useState(0)

  const job = useLoad(() => api.get(`/public/jobs/${id}`).then((r) => r.data), [id])
  const apps = useLoad(
    () => api.get(`/recruiter/jobs/${id}/applications`, { params: { pageNumber: page, pageSize: 20 } }).then((r) => r.data),
    [id, page],
  )

  return (
    <div>
      <Link to="/dashboard" className="font-semibold underline underline-offset-4 hover:bg-mark">All jobs</Link>
      <h2 className="mt-4 text-3xl font-bold">Applicants{job.data ? ` for ${job.data.jobName}` : ''}</h2>

      <div className="mt-6">
        {apps.error ? (
          <ErrorNote onRetry={apps.reload}>{apps.error}</ErrorNote>
        ) : apps.loading && !apps.data ? (
          <Loading />
        ) : apps.data.content.length === 0 ? (
          <Empty title="Nobody has applied yet">Applications appear here as soon as someone sends one.</Empty>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead>
                  <tr className="border-y-2 border-ink">
                    <th className="py-2 pr-4 font-bold">Name</th>
                    <th className="py-2 pr-4 font-bold">Email</th>
                    <th className="py-2 pr-4 font-bold">Applied</th>
                    <th className="py-2 font-bold">Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.data.content.map((a) => (
                    <tr key={a.applicationId} className="border-b border-rule">
                      <td className="py-3 pr-4 font-bold">{a.userName}</td>
                      <td className="py-3 pr-4"><a href={`mailto:${a.userEmail}`} className="underline underline-offset-4 hover:bg-mark">{a.userEmail}</a></td>
                      <td className="py-3 pr-4 whitespace-nowrap">{fullDate(a.appliedDate)}</td>
                      <td className="py-3">
                        {a.resumeURL
                          ? <a href={a.resumeURL} target="_blank" rel="noreferrer noopener" className="font-semibold underline underline-offset-4 hover:bg-mark">Open resume</a>
                          : <span className="text-ink-soft">Not provided</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={apps.data.pageNumber} totalPages={apps.data.totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
