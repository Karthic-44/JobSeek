import { Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Guard from './components/Guard'
import Home from './pages/Home'
import JobDetail from './pages/JobDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import MyApplications from './pages/MyApplications'
import Dashboard from './pages/dashboard/Dashboard'
import DashboardJobs from './pages/dashboard/DashboardJobs'
import Applicants from './pages/dashboard/Applicants'
import Categories from './pages/dashboard/Categories'
import Recruiters from './pages/dashboard/Recruiters'
import Overview from './pages/dashboard/Overview'

function NotFound() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl font-bold">No page at this address</h1>
      <p className="mt-3 text-ink-soft">The link may be old, or the job may have been taken down.</p>
      <Link to="/" className="mt-5 inline-block font-semibold underline underline-offset-4 hover:bg-mark">
        Go to the job list
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="applications" element={<Guard><MyApplications /></Guard>} />

        <Route path="dashboard" element={<Guard role="recruiter"><Dashboard /></Guard>}>
          <Route index element={<DashboardJobs />} />
          <Route path="jobs/:id/applicants" element={<Applicants />} />
          <Route path="categories" element={<Guard role="admin"><Categories /></Guard>} />
          <Route path="recruiters" element={<Guard role="admin"><Recruiters /></Guard>} />
          <Route path="overview" element={<Guard role="admin"><Overview /></Guard>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
