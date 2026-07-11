import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Toaster} from 'react-hot-toast';
import React from 'react'
import Contact from './components/Contact'
import Navbar from './components/shared/Navbar'
import Home from './components/home/Home'
import About from './components/About'
import LogIn from './components/auth/Login'
import Register from './components/auth/Register'
import PrivateRoute from './components/PrivateRoute'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/dashboard/Dashboard'
import AdminJobs from './components/admin/jobs/AdminJobs'
import Recruiters from './components/admin/recruiters/Recruiters'
import Category from './components/admin/categories/Category'
import Jobs from './components/jobs/Jobs';






function App() {
  const [count, setCount] = useState(0)

  return (
    <React.Fragment>
         <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/jobs' element={<Jobs />} />

          <Route path='/' element={< PrivateRoute publicPage />}>
            <Route path='/login' element={<LogIn />} />
            <Route path='/register' element={<Register />} />
          </Route>

          <Route path='/' element={<PrivateRoute adminOnly />}>
            <Route path='/admin' element={ <AdminLayout />}>
              <Route path='' element={<Dashboard />} />
              <Route path='jobs' element={<AdminJobs />} />
              <Route path='recruiters' element={<Recruiters />} />
              <Route path='categories' element={<Category />} />
            </Route>
            
          </Route>
          </Routes>
          </Router>
          <Toaster position= 'bottom-center' />
    </React.Fragment>
  )
}

export default App
