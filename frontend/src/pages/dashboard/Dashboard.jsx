import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth'

const tab = ({ isActive }) =>
  `-mb-0.5 border-b-4 px-1 py-2 font-semibold ${isActive ? 'border-ink' : 'border-transparent hover:underline'}`

export default function Dashboard() {
  const { isAdmin } = useAuth()
  return (
    <div>
      <h1 className="text-5xl font-bold">Dashboard</h1>
      <nav aria-label="Dashboard sections" className="mt-6 flex flex-wrap gap-x-6 border-b-2 border-ink">
        <NavLink to="/dashboard" end className={tab}>Jobs</NavLink>
        {isAdmin && <NavLink to="/dashboard/categories" className={tab}>Categories</NavLink>}
        {isAdmin && <NavLink to="/dashboard/recruiters" className={tab}>Recruiters</NavLink>}
        {isAdmin && <NavLink to="/dashboard/overview" className={tab}>Overview</NavLink>}
      </nav>
      <div className="pt-8">
        <Outlet />
      </div>
    </div>
  )
}
