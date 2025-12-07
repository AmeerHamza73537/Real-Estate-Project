import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setformData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }

      setLoading(false)
      setError(null)
      navigate('/sign-in')
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Create Account
        </h1>
        <p className="text-center text-slate-500 mb-6 text-sm">
          Join us and get started
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            id="username"
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email address"
            className="border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            id="email"
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            id="password"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="bg-slate-900 text-white p-3 rounded-lg font-semibold tracking-wide hover:bg-slate-800 transition disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="flex justify-center gap-1 mt-6 text-sm">
          <p className="text-slate-600">Already have an account?</p>
          <Link to="/sign-in" className="text-slate-900 font-semibold hover:underline">
            Sign In
          </Link>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default SignUp
