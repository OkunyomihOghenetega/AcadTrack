
import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import html2pdf from 'html2pdf.js'
import API_URL from '../api'

function RequestView() {
  const { id } = useParams()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const location = useLocation()
  const successMessage = location.state?.successMessage

  const transcriptRef = useRef(null)

  useEffect(() => {
    async function fetchRequest() {
      try {
        const response = await axios.get(`${API_URL}/requests/${id}`)
        setRequest(response.data)
      } catch (err) {
        setError('Could not load this request. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [id])

  async function downloadTranscript() {
    if (!transcriptRef.current || !request) return

    try {
      await html2pdf()
        .set({
          margin: 10,
          filename: `AcadTrack-Transcript-${request.matricNumber || request.id}.pdf`,
          jsPDF: {
            format: 'a4',
            orientation: 'portrait',
          },
          html2canvas: {
            scale: 2,
            backgroundColor: '#ffffff',
            onclone: (clonedDocument) => {
              const styles = clonedDocument.querySelectorAll('style')

              styles.forEach((style) => {
                style.textContent = style.textContent.replace(
                  /oklch\([^)]*\)/g,
                  '#000000'
                )
              })
            },
          },
        })
        .from(transcriptRef.current)
        .save()
    } catch (err) {
      console.error('Transcript download failed:', err)
      alert('The transcript could not be downloaded. Please try again.')
    }
  }

  if (loading) {
    return <p className="p-6 text-gray-500">Loading request details...</p>
  }

  if (!request) {
    return (
      <div className="space-y-4">
        <p className="text-red-700">
          {error || 'Request not found.'}
        </p>

        <Link to="/my-requests" className="text-[#312E81] underline">
          Back to My Requests
        </Link>
      </div>
    )
  }

  const status = request.status || 'Submitted'
  const timeline = request.timeline || []

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/my-requests"
        className="text-sm font-medium text-[#312E81] hover:underline"
      >
        ← Back to My Requests
      </Link>

      {successMessage && (
        <p className="border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {successMessage}
        </p>
      )}

      <div>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">
          Request Details
        </h1>

        <p className="mt-2 text-gray-600">
          View the information and progress of your transcript request.
        </p>
      </div>

      {/* Request information */}
      <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            Request Information
          </h2>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-[#312E81]">
            {status}
          </span>
        </div>

        <Detail
          label="Request ID"
          value={request.requestId || `TR-${request.id}`}
        />

        <Detail label="Full Name" value={request.fullName} />
        <Detail label="Matric Number" value={request.matricNumber} />
        <Detail label="Faculty" value={request.faculty} />
        <Detail label="Department" value={request.department} />
        <Detail label="Request Type" value={request.requestType} />
        <Detail label="Purpose" value={request.purpose} />
        <Detail label="Delivery Method" value={request.deliveryMethod} />

        <Detail
          label="Date Submitted"
          value={
            request.submittedAt
              ? new Date(request.submittedAt).toLocaleDateString()
              : 'Not recorded'
          }
        />
      </section>

      {/* Request status history */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Status History
        </h2>

        {timeline.length > 0 ? (
          <div className="space-y-4">
            {timeline.map((entry, index) => (
              <div
                key={`${entry.at}-${index}`}
                className="border-l-2 border-indigo-200 pl-4"
              >
                <p className="font-medium text-[#1E1B4B]">
                  {entry.status}
                </p>

                <p className="text-sm text-gray-500">
                  {entry.at
                    ? new Date(entry.at).toLocaleString()
                    : 'Date not recorded'}
                </p>

                {entry.note && (
                  <p className="mt-1 text-sm text-gray-600">
                    {entry.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No status updates have been recorded yet.
          </p>
        )}
      </section>

      {/* Digital transcript download */}
      {status === 'Completed' && request.deliveryMethod === 'digital' && (
        <div className="space-y-4">
          <section
            ref={transcriptRef}
            className="space-y-5 bg-white p-8"
            style={{
              backgroundColor: '#ffffff',
              color: '#222222',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <h2 className="text-center text-2xl font-bold">
              LEAD CITY UNIVERSITY
            </h2>

            <p className="text-center text-lg font-semibold">
              Academic Transcript
            </p>

            <div className="border-t border-gray-300 pt-4">
              <p>Student Name: {request.fullName}</p>
              <p>Matric Number: {request.matricNumber}</p>
              <p>Department: {request.department}</p>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">
                Course Results
              </h3>

              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="p-2">Course Code</th>
                    <th className="p-2">Course Title</th>
                    <th className="p-2">Units</th>
                    <th className="p-2">Grade</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-2">CSC 101</td>
                    <td className="p-2">Introduction to Computing</td>
                    <td className="p-2">3</td>
                    <td className="p-2">A</td>
                  </tr>

                  <tr className="border-b border-gray-200">
                    <td className="p-2">CSC 102</td>
                    <td className="p-2">Computer Programming</td>
                    <td className="p-2">3</td>
                    <td className="p-2">B</td>
                  </tr>

                  <tr className="border-b border-gray-200">
                    <td className="p-2">MTH 101</td>
                    <td className="p-2">Elementary Mathematics</td>
                    <td className="p-2">3</td>
                    <td className="p-2">B</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="border-t border-gray-300 pt-4 text-center text-xs text-gray-500">
              Demo transcript — sample academic data. Not an official university transcript.
            </p>
          </section>

          <button
            type="button"
            onClick={downloadTranscript}
            className="rounded bg-[#312E81] px-4 py-2 text-white hover:bg-[#252263]"
          >
            Download Transcript
          </button>
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-100 py-3 sm:grid-cols-[180px_1fr]">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="break-words font-medium text-gray-800">
        {value || 'Not provided'}
      </p>
    </div>
  )
}

export default RequestView
