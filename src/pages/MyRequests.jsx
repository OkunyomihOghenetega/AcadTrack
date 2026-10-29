
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth  } from '../context/AuthContext'

function MyRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const {user} = useAuth()
  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await axios.get(
          'http://localhost:3001/requests'
        )
        
        setRequests(
          response.data.filter(
            (request) => request.studentId === user.studentId
          )
        )
      } catch (error) {
        console.error('Failed to fetch requests:', error)
        setError('Unable to load your requests. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-gray-500">
          Transcript Requests
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-[#1E1B4B]">
          My Requests
        </h1>

        <p className="mt-2 text-gray-600">
          View and track your transcript requests.
        </p>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading your requests...</p>
      ) : requests.length === 0 && !error ? (
        <div className="border border-gray-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-[#1E1B4B]">
            No requests yet
          </h2>
          <p className="mt-2 text-gray-600">
            Your transcript requests will appear here after you submit one.
          </p>
          <Link
            to="/new-request"
            className="mt-4 inline-block bg-[#312E81] px-5 py-2 font-medium text-white"
          >
            Create a Request
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="border border-gray-200 bg-white p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {request.requestId || `TR-${request.id}`}
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#1E1B4B]">
                    {request.requestType || 'Transcript Request'}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {request.matricNumber || 'Matric number unavailable'}
                  </p>
                </div>

                <span className="self-start bg-[#312E81] px-3 py-1 text-xs font-medium text-white">
                  {request.status || 'Submitted'}
                </span>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500">Purpose</p>

                <p className="mt-1 text-sm text-gray-700">
                  {request.purpose || 'No purpose provided'}
                </p>
              </div>

              <div className="mt-5">
                <Link
                  to={`/my-requests/${request.id}`}
                  className="text-sm font-medium text-[#312E81] hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRequests
