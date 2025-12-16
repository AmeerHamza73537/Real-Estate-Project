import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

const Header = () => {
  const {currentUser} = useSelector(state => state.user)
  const {searchTerm, setSearchTerm} = useState('')
  const navigate = useNavigate()
  console.log(currentUser);
  
  const handleSubmit = (e)=>{
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search/${searchQuery}`)
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const searchTermFromUrl = urlParams.toString()
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search])

  return (
    <header className='bg-[#0A2A43] shadow-md'>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Jaidaad</span>
            <span className="text-slate-700">Becho</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center" >
          <input 
            type="text" 
            placeholder='Search...' 
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}  
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to='/'>
            <li className="hidden sm:inline text-[#FFFFFF] hover:underline">Home</li>
          </Link>
          <Link to='/about'>
            <li className="hidden sm:inline text-[#FFFFFF] hover:underline">About</li>
          </Link>
          <Link to='/profile'>
            { currentUser ? 
              // ( <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" /> )
              (<p className='text-[#FFFFFF] hover:underline'>{currentUser.username}</p>) 
             :( <li className="text-[#FFFFFF] hover:underline">Sign In</li> ) 
            }
          </Link>
          {/* <li>
            {currentUser ? (
              <Link to='/profile'>
                <img
                  className='rounded-full h-7 w-7 object-cover'
                  src={currentUser.avatar || '/default-avatar.png'}
                  alt="profile"
                />
              </Link>
            ) : (<Link to='/sign-in' className="text-[#FFFFFF] hover:underline"> Sign In </Link>)
            }
          </li> */}
        </ul>
      </div>
    </header>
  )
}
export default Header