import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Login() {
    const [username, setUsername ] = useState('')
    const [password, setPassword ] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const {login} = useAuth()

    const demoAccounts = [
        {studentId:"student-001", username: "student1", password: "student123", role: "student"},
        {studentId:"student-002", username: "student2", password: "student123", role: "student"},
        {studentId:null, username: "admin", password: "admin123", role: "admin"}
    ]

    function handleUsernameChange(event){
        setUsername(event.target.value)
    }
    
    function handlePasswordChange(event){
        setPassword(event.target.value)
    }


    async function handleSubmit(event) {
        event.preventDefault()
        setError('')

        const account = demoAccounts.find(
            (account) =>
                account.username === username &&
                account.password === password
        )

        let matchedAccount = account

        if (!matchedAccount) {
            try {
                const response = await axios.get('http://localhost:3001/accounts')
                const registeredAccounts = response.data

                matchedAccount = registeredAccounts.find(
                    (account) =>
                        account.username.toLowerCase() === username.trim().toLowerCase() &&
                        account.password === password
                )
            } catch (error) {
                setError('Unable to connect. Please try again.')
                return
            }
        }

        if (!matchedAccount) {
            setError('Invalid username or password')
            return
        }

        login(matchedAccount)
        navigate(matchedAccount.role === 'admin' ? '/admin' : '/dashboard')
    }


 
    return (
    <div className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-950">AcadTrack</h1>
            <p className="mt-1 text-sm text-gray-600">
            Transcript Request and Tracking Portal
            </p>
        </div>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Log in
        </h2>
        <p className="mb-6 text-sm text-gray-600">
            Enter your username and password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="mb-1 block text-sm text-gray-800">
                Username
            </label>
            <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
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
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
                className="w-full border border-gray-400 px-3 py-2 outline-none focus:border-blue-900"
            />
            </div>

            {error && (
            <p role="alert" className="text-sm text-red-700">
                {error}
            </p>
            )}

            <button
            type="submit"
            className="w-full bg-blue-950 px-4 py-2.5 text-white hover:bg-blue-900"
            >
            Log in
            </button>

            <p className="pt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-900 underline">
                Register here
            </Link>
            </p>
        </form>
        </div>
    </div>
    )
}

export default Login