import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import html2pdf from 'html2pdf.js'


const API_URL = 'http://localhost:3001/requests'


function getStatuses(deliveryMethod) {
  const commonStatuses = [
    'Submitted',
    'Under Review',
    'Processing',
    'Approved',
  ]

  if (deliveryMethod === 'digital') {
    return [...commonStatuses, 'Completed', 'Rejected']
  }

  return [
    ...commonStatuses,
    'Ready for Collection',
    'Completed',
    'Rejected',
  ]
}


function RequestDetails() {
  const { id } = useParams()


  const [request, setRequest] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const transcriptRef = useRef(null)

  useEffect(() => {
    async function fetchRequest() {
      try {
        const response = await axios.get(`${API_URL}/${id}`)
        setRequest(response.data)
        setSelectedStatus(response.data.status || 'Submitted')
      } catch (err) {
        setError('Could not load this request. Check the request ID.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [id])

  async function updateStatus(event) {
    event.preventDefault()
    if (!request) return

    setSaving(true)
    setMessage('')
    setError('')

    const currentStatus = request.status || 'Submitted'

    if (selectedStatus === currentStatus && !note.trim()) {
      setMessage('No status change or note to save.')
      setSaving(false)
      return
    }

    const oldTimeline = request.timeline || [
      {
        status: currentStatus,
        at: request.submittedAt || '',
        note: 'Request submitted',
      },
    ]

    const newEntry = {
      status: selectedStatus,
      at: new Date().toISOString(),
      note: note.trim() || `Status set to ${selectedStatus}`,
    }

    const updatedRequest = {
     status: selectedStatus,
     timeline: [...oldTimeline, newEntry],
     completedAt:
        selectedStatus === 'Completed'
        ? request.status === 'Completed'
        ? request.completedAt || new Date().toISOString()
          : new Date().toISOString()
            : null,
    }

    try {
      const response = await axios.patch(
        `${API_URL}/${id}`,
        updatedRequest
      )

      setRequest(response.data)
      setNote('')
      setMessage('Request updated successfully.')
    } catch (err) {
      setError('Could not save the update. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }
    
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
        <p className="text-red-700">{error || 'Request not found.'}</p>
        <Link to="/admin" className="text-[#312E81] underline">
          Back to Admin Dashboard
        </Link>
      </div>
    )
  }

  const timeline = request.timeline || [
    {
      status: request.status || 'Submitted',
      at: request.submittedAt || '',
      note: 'Request submitted',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin"
          className="text-sm font-medium text-[#312E81] underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-semibold text-[#1E1B4B]">
          Request Details
        </h1>
        <p className="mt-2 text-gray-600">
          Review the student's request and record progress.
        </p>
      </div>

      {message && (
        <p className="border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {message}
        </p>
      )}

      {error && (
        <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section
        className="space-y-5 border border-gray-200 bg-white p-6"
      >
        <div className="border-b border-gray-200 pb-4">
          <p className="text-sm text-gray-500">AcadTrack Transcript Portal</p>
          <h2 className="mt-2 text-xl font-semibold text-[#1E1B4B]">
            {request.requestType || 'Transcript Request'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Request ID: {request.requestId || `TR-${request.id}`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Detail label="Student Name" value={request.fullName} />
          <Detail label="Matric Number" value={request.matricNumber} />
          <Detail label="Faculty" value={request.faculty} />
          <Detail label="Department" value={request.department} />
          <Detail label="Purpose" value={request.purpose} />
          <Detail label="Delivery Method" value={request.deliveryMethod} />
          <Detail
            label="Submitted"
            value={
              request.submittedAt
                ? new Date(request.submittedAt).toLocaleString()
                : 'Date not recorded'
            }
          />
          <Detail
            label="Current Status"
            value={request.status || 'Submitted'}
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-[#1E1B4B]">Request Timeline</h3>

          <ol className="mt-4 space-y-4">
            {timeline.map((entry, index) => (
              <li key={`${entry.at}-${index}`} className="border-l-2 border-[#312E81] pl-4">
                <p className="font-medium text-gray-800">{entry.status}</p>
                {entry.at && (
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(entry.at).toLocaleString()}
                  </p>
                )}
                {entry.note && (
                  <p className="mt-1 text-sm text-gray-600">{entry.note}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-[#1E1B4B]">
          Update Request
        </h2>
        
        {request.status === 'Completed' && (
          <section className="border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-[#1E1B4B]">
              Transcript
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Download the transcript for this student's request.
            </p>

            <div
              ref={transcriptRef}
              className="mt-5 space-y-5 p-6"
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
                <h3 className="mb-3 font-semibold">Course Results</h3>

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
                Demo transcript — sample academic data.
              </p>
            </div>

            <button
              type="button"
              onClick={downloadTranscript}
              className="mt-4 bg-[#312E81] px-4 py-2 text-white hover:bg-[#252263]"
            >
              Download Transcript
            </button>
  </section>
)}


        <form onSubmit={updateStatus} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New status
            </label>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="w-full border border-gray-300 bg-white px-3 py-2"
            >
              {getStatuses(request.deliveryMethod).map((status) => (
                <option key={status} value={status}>
                    {status}
                </option>
            ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Update note (optional)
            </label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Add a short note about this update..."
              className="w-full border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#312E81] px-5 py-2 font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Update'}
          </button>
        </form>
      </section>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 break-words font-medium text-gray-800">
        {value || 'Not provided'}
      </p>
    </div>
  )
}

export default RequestDetails
