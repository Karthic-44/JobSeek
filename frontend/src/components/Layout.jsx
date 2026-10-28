import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

const navLink = ({ isActive }) =>
  `border-b-4 px-0.5 py-0.5 font-semibold ${isActive ? 'border-ink' : 'border-transparent hover:bg-mark/70'}`

export default function Layout() {
  const { user, isRecruiter, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-4 sm:px-6">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            JobSeek
          </Link>

          <nav className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-1">
            <NavLink to="/" end className={navLink}>Jobs</NavLink>
            {user && <NavLink to="/applications" className={navLink}>My applications</NavLink>}
            {isRecruiter && <NavLink to="/dashboard" className={navLink}>Dashboard</NavLink>}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-ink-soft">
                  Signed in as <b className="text-ink">{user.username}</b>
                </span>
                <button
                  onClick={async () => { await logout(); navigate('/') }}
                  className="cursor-pointer font-semibold underline underline-offset-4 hover:bg-mark"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-semibold underline underline-offset-4 hover:bg-mark">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-[3px] border-2 border-ink bg-ink px-3 py-1.5 font-semibold text-panel hover:bg-mark hover:text-ink"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>

      <footer className="border-t-2 border-ink">
        <div className="mx-auto max-w-6xl px-4 py-5 text-sm text-ink-soft sm:px-6">
        </div>
      </footer>
    </div>
  )
}
