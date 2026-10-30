import { useState } from "react";
import axios from "axios"
import { useNavigate,Link } from "react-router-dom"
import API_URL from "../api";

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName:'',
        matricNumber:'',
        username:'',
        password:''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')


    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        })
    }

    
    async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (
        !formData.fullName.trim() ||
        !formData.matricNumber.trim() ||
        !formData.username.trim() ||
        !formData.password
    ) {
        setError('Please fill in all fields.')
        return
    }

    try {
        const response = await axios.get(`${API_URL}/accounts`)
        const accounts = response.data
        const existingAccount = accounts.find(
            (account) =>
            (account.username || '').toLowerCase() === formData.username.trim().toLowerCase() ||
            (account.matricNumber || '').toLowerCase() === formData.matricNumber.trim().toLowerCase()
        )
        if (existingAccount) {
        setError('That username or matric number is already registered.')
        return
        }

        const newAccount = {
        ...formData,
        fullName: formData.fullName.trim(),
        matricNumber: formData.matricNumber.trim(),
        username: formData.username.trim(),
        studentId: `student-${Date.now()}`,
        role: 'student'
        }

        await axios.post(`${API_URL}/accounts`, newAccount)

        setSuccess('Account created successfully! You can now log in.')
        setFormData({
        fullName: '',
        matricNumber: '',
        username: '',
        password: ''
        })
    } catch (error) {
        console.error('Registration failed:', error)
        setError('Unable to create your account. Please try again.')
    }
    }


 

    return (
    <div className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto w-full max-w-sm">
        <div className="mb-7">
            <h1 className="text-2xl font-bold text-blue-950">AcadTrack</h1>
            <p className="mt-1 text-sm text-gray-600">
            Transcript Request and Tracking Portal
            </p>
        </div>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Create an account
        </h2>
        <p className="mb-5 text-sm text-gray-600">
            Fill in your details to register.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
            <p role="alert" className="text-sm text-red-700">
                {error}
            </p>
            )}

            {success && (
            <p role="status" className="text-sm text-green-700">
                {success}
            </p>
            )}

            <div>
            <label className="mb-1 block text-sm text-gray-800">
                Full Name
            </label>
            <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full border border-gray-400 px-3 py-2 outline-none focus:border-blue-900"
            />
            </div>

            <div>
            <label className="mb-1 block text-sm text-gray-800">
                Matriculation Number
            </label>
            <input
                type="text"
                name="matricNumber"
                placeholder="Enter your matric number"
                value={formData.matricNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-400 px-3 py-2 outline-none focus:border-blue-900"
            />
            </div>

            <div>
            <label className="mb-1 block text-sm text-gray-800">
                Username
            </label>
            <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border border-gray-400 px-3 py-2 outline-none focus:border-blue-900"
            />
            </div>

            <div>
            <label className="mb-1 block text-sm text-gray-800">
                Password
            </label>
            <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-400 px-3 py-2 outline-none focus:border-blue-900"
            />
            </div>

            <button
            type="submit"
            className="w-full bg-blue-950 px-4 py-2.5 text-white hover:bg-blue-900"
            >
            Create account
            </button>

            <p className="pt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-900 underline">
                Log in
            </Link>
            </p>
        </form>
        </div>
    </div>
    )
}

export default Register