import api from '../../api'
import { useLoad } from '../../hooks'
import { ErrorNote, Loading } from '../../components/ui'

export default function Overview() {
  const { data, loading, error, reload } = useLoad(() => api.get('/admin/app/analytics').then((r) => r.data), [])

  if (error) return <ErrorNote onRetry={reload}>{error}</ErrorNote>
  if (loading) return <Loading />

  const rows = [
    ['Jobs posted', data.totalJobs],
    ['Categories', data.totalCategories],
    ['Applications received', data.totalApplications],
    ['Recruiters', data.totalRecruiters],
  ]

  return (
    <dl className="max-w-xl border-t-2 border-ink">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-6 border-b border-rule py-4">
          <dt className="text-lg">{label}</dt>
          <dd className="text-4xl font-bold">{value ?? 0}</dd>
        </div>
      ))}
    </dl>
  )
}
