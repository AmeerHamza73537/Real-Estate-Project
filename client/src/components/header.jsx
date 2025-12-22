import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

export default function Header() {
  const {currentUser} = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  console.log(currentUser);
  
  const handleSubmit = (e)=>{
    e.preventDefault()
    const term = searchTerm.trim()
    if(!term) return

    navigate(`/search?searchTerm=${encodeURIComponent(term)}`)
  }

  // const handleSubmit = (e)=>{
  //   e.preventDefault()
  //   const params = new URLSearchParams()
  //   if (searchTerm && searchTerm.trim() !== '') params.set('searchTerm', searchTerm.trim())
  //   navigate(`/search?${params.toString()}`)
  // }


  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search])

  return (
  <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0A2A43] to-[#0F3C5F] backdrop-blur-xl shadow-lg">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-1">
        <h1 className="text-lg sm:text-2xl font-extrabold tracking-wide">
          <span className="text-slate-200">Jaidaad</span>
          <span className="text-white ml-1">Becho</span>
        </h1>
      </Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="hidden md:flex items-center bg-white/95 rounded-full px-4 py-2 shadow-md w-[380px] focus-within:ring-2 focus-within:ring-slate-400 transition"
      >
        <input
          type="text"
          placeholder="Search properties, areas..."
          className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="text-slate-600 hover:text-slate-800 transition">
          <FaSearch />
        </button>
      </form>

      {/* Nav Links */}
      <ul className="flex items-center gap-6 text-sm font-medium">
        <Link to="/">
          <li className="hidden sm:inline text-slate-200 hover:text-white transition">
            Home
          </li>
        </Link>

        <Link to="/about">
          <li className="hidden sm:inline text-slate-200 hover:text-white transition">
            About
          </li>
        </Link>

        <Link to="/profile">
          {currentUser ? (
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold uppercase">
                {currentUser.username.charAt(0)}
              </div>
              <span className="hidden sm:inline text-slate-200 group-hover:text-white transition">
                {currentUser.username}
              </span>
            </div>
          ) : (
            <li className="text-white px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition">
              Sign In
            </li>
          )}
        </Link>
      </ul>
    </div>

    {/* Mobile Search */}
    <div className="md:hidden px-4 pb-3">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white/95 rounded-full px-4 py-2 shadow-md"
      >
        <input
          type="text"
          placeholder="Search properties..."
          className="flex-1 bg-transparent outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="text-slate-600">
          <FaSearch />
        </button>
      </form>
    </div>
  </header>
)

}