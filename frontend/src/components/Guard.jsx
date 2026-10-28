import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import { Loading } from './ui'

/** role: 'user' (any signed-in user), 'recruiter' or 'admin' */
export default function Guard({ role = 'user', children }) {
  const { user, checking, isRecruiter, isAdmin } = useAuth()
  const location = useLocation()

  if (checking && !user) return <Loading />
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />

  const allowed = role === 'admin' ? isAdmin : role === 'recruiter' ? isRecruiter : true
  if (!allowed) {
    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold">You don’t have access to this page</h1>
        <p className="mt-3 text-ink-soft">
          This area is for {role === 'admin' ? 'administrators' : 'recruiters'}. If you think that’s a mistake, sign in with a different account.
        </p>
      </div>
    )
  }
  return children
}
