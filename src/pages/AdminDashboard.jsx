
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const API_URL = 'http://localhost:3001/requests'

function AdminDashboard() {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchRequests() {
    try {
      setError('')
      const response = await axios.get(API_URL)
      setRequests(response.data)
    } catch (err) {
      setError('Could not load requests. Check that JSON Server is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const filteredRequests = requests.filter((request) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      (request.requestId || '').toLowerCase().includes(searchText) ||
      (request.fullName || '').toLowerCase().includes(searchText) ||
      (request.matricNumber || '').toLowerCase().includes(searchText) ||
      (request.requestType || '').toLowerCase().includes(searchText)

    const matchesStatus =
      statusFilter === 'All' ||
      (request.status || 'Submitted') === statusFilter

    return matchesSearch && matchesStatus
  })

  const countByStatus = (status) =>
    requests.filter(
      (request) => (request.status || 'Submitted') === status
    ).length

  const statuses = [
    'Submitted',
    'Under Review',
    'Processing',
    'Approved',
    'Ready for Collection',
    'Completed',
    'Rejected',
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-gray-500">
          Records Management
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#1E1B4B]">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Review and manage student transcript requests.
        </p>
      </div>

      {error && (
        <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Requests" value={requests.length} />
        <SummaryCard title="Submitted" value={countByStatus('Submitted')} />
        <SummaryCard title="Under Review" value={countByStatus('Under Review')} />
        <SummaryCard title="Completed" value={countByStatus('Completed')} />
      </div>

      <section className="border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-[#1E1B4B]">
            All Transcript Requests
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Search by student, matric number, request ID or request type.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search requests..."
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-[#312E81]"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#312E81]"
            >
              <option value="All">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Loading requests...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="p-6 text-gray-500">
            No requests match your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Request ID</th>
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Request Type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-[#1E1B4B]">
                      {request.requestId || `TR-${request.id}`}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {request.fullName || 'Student name unavailable'}
                      </p>
                      <p className="mt-1 text-gray-500">
                        {request.matricNumber || 'No matric number'}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {request.requestType || 'Not specified'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800">
                        {request.status || 'Submitted'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Link
                        to={`/admin/requests/${request.id}`}
                        className="font-medium text-[#312E81] underline underline-offset-4"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function SummaryCard({ title, value }) {
  return (
    <div className="border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-[#1E1B4B]">
        {value}
      </p>
    </div>
  )
}

export default AdminDashboard
