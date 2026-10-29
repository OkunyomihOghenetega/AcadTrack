import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'

import StudentDashboard from './pages/StudentDashboard'
import NewRequest from './pages/NewRequest'
import MyRequests from './pages/MyRequests'
import AdminDashboard from './pages/AdminDashboard'
import RequestDetails from './pages/RequestDetails'
import RequestView from './pages/RequestView'
import Login from './pages/Login'
import Register from './pages/Register'

import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Login/>}/>
          <Route path='/register' element = {<Register/>}/>

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/my-requests/:id" element={<RequestView />} />          
            <Route path="/new-request" element={<NewRequest />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="requests/:id" element={<RequestDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
