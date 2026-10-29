import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Layout() {
  const {logout,user} = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }
  const linkClass = ({ isActive }) =>
    isActive
      ? 'block bg-[#312E81] px-4 py-3 font-medium text-white'
      : 'block px-4 py-3 text-gray-300 hover:bg-white/10'

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col bg-[#1E1B4B] p-6 text-white">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">AcadTrack</h1>
          <p className="text-sm text-gray-300">Student Portal</p>
        </div>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/my-requests" className={linkClass}>
            My Requests
          </NavLink>
          <NavLink to="/new-request" className={linkClass}>
            New Request
          </NavLink>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <p className="font-medium">{user?.username || 'Student'}</p>
          <p className="text-sm text-gray-400">Student</p>

          <button
            onClick={handleLogout}
            className="mt-4 w-full border border-white/20 px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10"
          >
            Log Out
          </button>
        </div>

      </aside>

      <main className="min-w-0 flex-1 bg-[#F5F2EB] p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
