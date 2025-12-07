import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const SignIn = () => {
  const [formData, setformData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
        const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Welcome 👋
        </h1>
        <p className="text-center text-slate-500 mb-6 text-sm">
          Sign in to your account
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

          <OAuth />

          <button
            disabled={loading}
            className="bg-slate-900 text-white p-3 rounded-lg font-semibold tracking-wide hover:bg-slate-800 transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex justify-center gap-1 mt-6 text-sm">
          <p className="text-slate-600">Don’t have an account?</p>
          <Link to="/sign-up" className="text-slate-900 font-semibold hover:underline">
            Sign Up
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

export default SignIn
