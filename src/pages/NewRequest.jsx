import { useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import API_URL from "../api"

function NewRequest() {
  const {user} = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    matricNumber: '',
    faculty: '',
    department: '',
    requestType: 'Official Transcript',
    purpose: '',
    deliveryMethod: '',
  })

  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  function validateForm() {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.matricNumber.trim()) {
      newErrors.matricNumber = 'Matric number is required'
    }

    if (!formData.faculty.trim()) {
      newErrors.faculty = 'Faculty is required'
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required'
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required'
    }

    if (!formData.deliveryMethod) {
      newErrors.deliveryMethod = 'Please select a delivery method'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    const requestId = `TR-${Date.now().toString().slice(-5)}`

    const requestData = {
      ...formData,
      requestId,
      status: 'Submitted',
      studentId: user.studentId,
      submittedAt: new Date().toISOString()
    }

    try {
      const response = await axios.post(`${API_URL}/requests`, requestData)

      navigate(`/my-requests/${response.data.id}`, {
        state: {
          successMessage: 'Your transcript request was submitted successfully.'
        }
      })
    } catch (error) {
      console.error('Failed to submit request:', error)
      setErrors((previousErrors) => ({
        ...previousErrors,
        submit: 'Unable to submit your request. Please try again.'
      }))
    }
  }
  return (
    <form
      className="max-w-4xl space-y-8"
      onSubmit={handleSubmit}
    >
      {errors.submit && (
        <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errors.submit}
        </p>
      )}

      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-gray-500">
          Transcript Requests
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-[#1E1B4B]">
          New Transcript Request
        </h1>

        <p className="mt-2 text-gray-600">
          Provide the required information to submit your transcript request.
        </p>
      </div>


      {/* Student Information */}
      <section className="border border-gray-200 bg-white p-6">

        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-[#1E1B4B]">
            Student Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Confirm your academic information before continuing.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#7C3AED]"
            />

            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName}
              </p>
            )}
          </div>


          {/* Matric Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Matric Number
            </label>

            <input
              type="text"
              name="matricNumber"
              value={formData.matricNumber}
              onChange={handleChange}
              placeholder="Enter your matric number - LCU/UG/23/12345"
              className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#7C3AED]"
            />

            {errors.matricNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.matricNumber}
              </p>
            )}
          </div>


          {/* Faculty */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Faculty
            </label>

            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              placeholder="Enter your faculty"
              className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#7C3AED]"
            />

            {errors.faculty && (
              <p className="mt-1 text-sm text-red-600">
                {errors.faculty}
              </p>
            )}
          </div>


          {/* Department */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Department
            </label>

            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter your department"
              className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#7C3AED]"
            />

            {errors.department && (
              <p className="mt-1 text-sm text-red-600">
                {errors.department}
              </p>
            )}
          </div>

        </div>
      </section>


      {/* Request Details */}
      <section className="border border-gray-200 bg-white p-6">

        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-[#1E1B4B]">
            Request Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Tell us what you need the transcript for.
          </p>
        </div>

        <div className="space-y-5">

          {/* Request Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Request Type
            </label>

            <select
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#7C3AED]"
            >
              <option value="Official Transcript">
                Official Transcript
              </option>
            </select>
          </div>


          {/* Purpose */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Purpose
            </label>

            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows="4"
              placeholder="Briefly explain the purpose of this transcript request"
              className="w-full resize-none border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#7C3AED]"
            ></textarea>

            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">
                {errors.purpose}
              </p>
            )}
          </div>

        </div>
      </section>


      {/* Delivery */}
      <section className="border border-gray-200 bg-white p-6">

        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-[#1E1B4B]">
            Delivery Method
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select how you would like to receive your transcript.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          {/* Digital PDF */}
          <label className="flex cursor-pointer items-start gap-3 border border-gray-300 p-4 hover:border-[#7C3AED]">

            <input
              type="radio"
              name="deliveryMethod"
              value="digital"
              checked={formData.deliveryMethod === 'digital'}
              onChange={handleChange}
              className="mt-1"
            />

            <div>
              <p className="font-medium text-[#1E1B4B]">
                Digital PDF
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Receive your transcript as a downloadable PDF.
              </p>
            </div>

          </label>


          {/* Physical Collection */}
          <label className="flex cursor-pointer items-start gap-3 border border-gray-300 p-4 hover:border-[#7C3AED]">

            <input
              type="radio"
              name="deliveryMethod"
              value="physical"
              checked={formData.deliveryMethod === 'physical'}
              onChange={handleChange}
              className="mt-1"
            />

            <div>
              <p className="font-medium text-[#1E1B4B]">
                Physical Collection
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Collect the transcript physically from the records office.
              </p>
            </div>

          </label>

        </div>

        {errors.deliveryMethod && (
          <p className="mt-2 text-sm text-red-600">
            {errors.deliveryMethod}
          </p>
        )}

      </section>


      {/* Actions */}
      <div className="flex justify-end gap-3 pb-4">

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-[#F97316] px-5 py-3 text-sm font-medium text-white hover:bg-orange-600"
        >
          Review Request
        </button>

      </div>

    </form>
  )
}

export default NewRequest