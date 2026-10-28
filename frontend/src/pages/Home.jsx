import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import { useDebounced, useLoad } from '../hooks'
import { Empty, ErrorNote, Highlight, Loading, Pager } from '../components/ui'
import { splitSkills, timeAgo } from '../format'

const PAGE_SIZE = 8

function JobRow({ job, query }) {
  const skills = splitSkills(job.requiredSkill)
  return (
    <li>
      <Link
        to={`/jobs/${job.jobId}`}
        className="group grid gap-x-8 gap-y-1 border-b border-rule border-l-4 border-l-transparent py-5 pl-4 pr-2 hover:border-l-ink hover:bg-panel sm:grid-cols-[1fr_auto]"
      >
        <div>
          <h2 className="text-[1.45rem] font-bold leading-tight group-hover:underline group-hover:underline-offset-4">
            <Highlight text={job.jobName} query={query} />
          </h2>
          <p className="mt-0.5">
            <Highlight text={job.company || 'Company not listed'} query={query} />
            {job.location && <span className="text-ink-soft">, {job.location}</span>}
          </p>
          {skills.length > 0 && (
            <p className="mt-1.5 text-ink-soft">
              <Highlight text={skills.join(', ')} query={query} />
            </p>
          )}
        </div>
        <div className="text-ink-soft sm:text-right">
          {job.salary && <p className="font-semibold text-ink">{job.salary}</p>}
          <p>{timeAgo(job.postedAt)}</p>
        </div>
      </Link>
    </li>
  )
}

export default function Home() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const categoryId = params.get('c') || ''
  const page = Number(params.get('p') || 0)

  const [text, setText] = useState(q)
  const debounced = useDebounced(text, 300)

  // typing updates the URL after a short pause, so the page is shareable
  useEffect(() => {
    if (debounced === q) return
    setParams((old) => {
      const next = new URLSearchParams(old)
      if (debounced) next.set('q', debounced); else next.delete('q')
      next.delete('p')
      return next
    }, { replace: true })
  }, [debounced]) // eslint-disable-line react-hooks/exhaustive-deps

  const categories = useLoad(
    () => api.get('/public/categories', { params: { pageSize: 100, sortBy: 'categoryName', sortOrder: 'asc' } }).then((r) => r.data.content),
    [],
  )

  const jobs = useLoad(
    () =>
      api
        .get('/public/jobs', {
          params: {
            keyword: q || undefined,
            categoryId: categoryId || undefined,
            pageNumber: page,
            pageSize: PAGE_SIZE,
            sortBy: 'jobId',
            sortOrder: 'desc',
          },
        })
        .then((r) => r.data),
    [q, categoryId, page],
  )

  function setFilter(key, value) {
    setParams((old) => {
      const next = new URLSearchParams(old)
      if (value) next.set(key, value); else next.delete(key)
      next.delete('p')
      return next
    })
  }

  const total = jobs.data?.totalElements
  const activeCategory = categories.data?.find((c) => String(c.categoryId) === categoryId)

  return (
    <div>
      <label htmlFor="search" className="block text-ink-soft">
        Search by job title, company or skill
      </label>
      <input
        id="search"
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="search jobs ..."
        autoComplete="off"
        className="mt-1 w-full border-0 border-b-4 border-ink bg-transparent pb-2 text-4xl font-bold tracking-tight placeholder:text-ink/25 focus:bg-panel focus:outline-none sm:text-6xl"
      />

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside aria-label="Categories">
          <p className="mb-2 font-bold">Category</p>
          <ul className="-mx-1 flex items-start gap-x-3 gap-y-1 overflow-x-auto px-1 pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            <li className="shrink-0">
              <button
                onClick={() => setFilter('c', '')}
                aria-pressed={!categoryId}
                className={`cursor-pointer whitespace-nowrap px-1 py-1 text-left ${!categoryId ? 'font-bold' : 'hover:bg-mark/70'}`}
              >
                All jobs
              </button>
            </li>
            {categories.data?.map((c) => {
              const on = String(c.categoryId) === categoryId
              return (
                <li key={c.categoryId} className="shrink-0">
                  <button
                    onClick={() => setFilter('c', on ? '' : String(c.categoryId))}
                    aria-pressed={on}
                    className={`cursor-pointer whitespace-nowrap px-1 py-1 text-left ${on ? 'font-bold' : 'hover:bg-mark/70'}`}
                  >
                    {c.categoryName}
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <section aria-live="polite">
          <p className="mb-1 text-lg font-bold">
            {jobs.loading && !jobs.data
              ? 'Looking for jobs'
              : total === 0
                ? 'No matching jobs'
                : `${total} ${total === 1 ? 'job' : 'jobs'}${q ? ` matching “${q}”` : ''}${activeCategory ? ` in ${activeCategory.categoryName}` : ''}`}
          </p>

          {jobs.error ? (
            <ErrorNote onRetry={jobs.reload}>{jobs.error}</ErrorNote>
          ) : jobs.loading && !jobs.data ? (
            <Loading />
          ) : jobs.data?.content.length === 0 ? (
            <Empty title={q || categoryId ? 'Nothing matches that search' : 'No jobs are posted yet'}>
              {q || categoryId
                ? 'Try a shorter word, or clear the category to see everything.'
                : 'Recruiters can post jobs from the dashboard. They will show up here straight away.'}
            </Empty>
          ) : (
            <>
              <ul className={`border-t-2 border-ink ${jobs.loading ? 'opacity-60' : ''}`}>
                {jobs.data.content.map((job) => (
                  <JobRow key={job.jobId} job={job} query={q} />
                ))}
              </ul>
              <Pager
                page={jobs.data.pageNumber}
                totalPages={jobs.data.totalPages}
                onChange={(p) => {
                  setParams((old) => { const n = new URLSearchParams(old); n.set('p', p); return n })
                  window.scrollTo({ top: 0 })
                }}
              />
            </>
          )}
        </section>
      </div>
    </div>
  )
}
