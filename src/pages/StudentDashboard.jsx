
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import API_URL from '../api'

function StudentDashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { user } = useAuth()

  const studentName =
    user?.fullName?.split(' ')[0] || user?.username || 'Student'

  useEffect(() => {
    async function fetchRequests() {
      if (!user?.studentId) {
        setRequests([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await axios.get(`${API_URL}/requests`)

        const studentRequests = response.data
          .filter((request) => request.studentId === user.studentId)
          .sort((a, b) => {
            return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0)
          })

        setRequests(studentRequests)
      } catch (error) {
        console.error('Failed to fetch requests:', error)
        setError('Unable to load your requests. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [user?.studentId])

  const currentRequest = requests[0]
  const previousRequests = requests.slice(1)

  const progressSteps = [
    'Submitted',
    'Under Review',
    'Processing',
    'Approved',
    'Ready for Collection',
    'Completed',
  ]

  const status = currentRequest?.status || 'Submitted'
  const isRejected = status === 'Rejected'
  const isCompleted = status === 'Completed'

  const progressIndex = progressSteps.indexOf(status)

  const progress = isCompleted
    ? 100
    : progressIndex >= 0
      ? ((progressIndex + 1) / progressSteps.length) * 100
      : 0

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-gray-500">
          Student Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-[#1E1B4B]">
          Good day, {studentName}
        </h1>

        <p className="mt-2 text-gray-600">
          Track your transcript requests and stay updated.
        </p>
      </div>

      {error && (
        <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Loading your requests...</p>
      ) : !currentRequest ? (
        <section className="border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-[#1E1B4B]">
            No current request
          </h2>

          <p className="mt-2 text-gray-600">
            Submit a transcript request to start tracking its progress.
          </p>

          <Link
            to="/new-request"
            className="mt-5 inline-block bg-[#F97316] px-5 py-3 text-sm font-medium text-white"
          >
            Make New Request
          </Link>
        </section>
      ) : (
        <section className="border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Latest Request
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#1E1B4B]">
                {currentRequest.requestType || 'Transcript Request'}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Request ID: {currentRequest.requestId || `TR-${currentRequest.id}`}
              </p>
            </div>

            <span className="self-start bg-[#312E81] px-3 py-1 text-xs font-medium text-white">
              {status}
            </span>
          </div>

          <div className="p-6">
            {isRejected ? (
              <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                This request has been rejected. Please review the request details for further information.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap justify-between gap-2 text-xs font-medium text-gray-500 sm:text-sm">
                  {progressSteps.map((step, index) => (
                    <span
                      key={step}
                      className={
                        index <= progressIndex
                          ? 'text-[#312E81]'
                          : 'text-gray-400'
                      }
                    >
                      {step}
                    </span>
                  ))}
                </div>

                <div className="mt-4 h-2 bg-gray-200">
                  <div
                    className="h-2 bg-[#7C3AED] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}

            <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isCompleted ? 'Completed on' : 'Expected completion'}
                </p>

                <p className="mt-1 font-medium text-[#1E1B4B]">
                  {isCompleted
                    ? currentRequest.completedAt
                      ? new Date(currentRequest.completedAt).toLocaleDateString()
                      : 'Marked completed; date not recorded'
                    : 'To be confirmed'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/my-requests/${currentRequest.id}`}
                  className="border border-[#312E81] px-4 py-2 text-sm font-medium text-[#312E81]"
                >
                  View Request
                </Link>

                {isCompleted && currentRequest.deliveryMethod === 'digital' && (
                  <Link
                    to={`/my-requests/${currentRequest.id}`}
                    className="bg-[#F97316] px-4 py-2 text-sm font-medium text-white"
                  >
                    View Transcript
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#1E1B4B]">
          Previous Requests
        </h2>

        <div className="divide-y divide-gray-200 border-y border-gray-200 bg-white">
          {loading ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              Loading previous requests...
            </p>
          ) : previousRequests.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              No previous requests yet.
            </p>
          ) : (
            previousRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-[#1E1B4B]">
                    {request.requestType || 'Transcript Request'}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {request.requestId || `TR-${request.id}`}
                  </p>
                </div>

                <Link
                  to={`/my-requests/${request.id}`}
                  className="text-sm font-medium text-[#312E81] underline"
                >
                  View request
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <Link
          to="/new-request"
          className="bg-[#F97316] px-5 py-3 text-sm font-medium text-white hover:bg-orange-600"
        >
          + Make New Request
        </Link>
      </div>
    </div>
  )
}

export default StudentDashboard
