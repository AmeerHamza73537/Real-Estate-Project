import React, { useState, useEffect } from 'react'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
// import getStorage from 'firebase/storage'
import {updateUserStart, updateUserSuccess, updateUserFailure, signInFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signOutUserStart} from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'
const Profile = () => {

//                                      --- YT VIDEO --- 

  // const [loading, setLoading] = useState(false)

  // const handleFileUpload = async (e)=>{
  //   const file = e.target.files[0]
  //   if(!file) return
  //   const data = new FormData()
  //   data.append("file", file)
  //   data.append("upload_preset", "svrrjvja")
  //   data.append("cloud_name", "dtcb2mugy")

  //   const res = await fetch("https://api.cloudinary.com/v1_1/dtcb2mugy/image/upload", {
  //     method: 'POST',
  //     body: data,
  //   })

  //   const uploadImageUrl = await res.json()
  //   console.log(uploadImageUrl.url);
  //   setLoading(false)
  // }




  const {currentUser, loading, error} = useSelector(state => state.user)
  // const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [userListings, setUserListings] = useState([])
  const [showListings, setShowListings] = useState(false)
  const dispatch = useDispatch()
  // console.log(file);
  // useEffect(()=>{
  //   if(file){
  //     handleFileUpload(file)
  //   }
  // },[file])
  // const handleFileUpload = (file)=>{
  //   // const storage = getStorage()
  // }

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    console.log(currentUser._id);  
    try {
      dispatch(updateUserStart())
      const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData) 
      })
      const data = await res.json()
      if(data.message === false){
        dispatch(updateUserFailure(data.message))
        return
      }
      setUpdateSuccess(true)
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }
  const handleDelete = async (e)=>{
    try {
      deleteUserStart()
      const res = await fetch(`http://localhost:3000/api/user/delete/${currentUser._id}`,{
      method: 'DELETE',
      credentials: 'include',  
    })
    const data = await res.json()
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return
    }
    dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
    // navigate('/')
  }
  const handleSignOut = async ()=>{
    try {
      dispatch(signOutUserStart())
      const res = await fetch('http://localhost:3000/api/auth/sign-out', {
        credentials: 'include'
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleClickListings = async ()=>{
    // Guard: ensure user is loaded
    if (!currentUser || !currentUser._id) {
      console.warn('handleClickListings: no currentUser');
      setShowListingError(true);
      return;
    }

    try {
      setShowListingError(false)
      const url = `/api/user/listings/${currentUser._id}`
      console.log('Fetching listings from', url)
      const res = await fetch(url, {
        credentials: 'include'
      })

      console.log('Listings response status:', res.status)
      if (!res.ok) {
        const text = await res.text().catch(() => null)
        console.error('Listings fetch failed:', res.status, text)
        setShowListingError(true)
        return
      }

      const data = await res.json()
      // backend returns array of listings — set directly
      setUserListings(Array.isArray(data) ? data : [])
      setShowListings(true)
    } catch (error) {
      console.error('handleClickListings error:', error)
      setShowListingError(true)
    }
  }

  const handleHideListings = () => {
    setShowListings(false)
    setUserListings([])
  }

  const handleDeleteListings = async (listingId)=>{
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method:'DELETE',
        credentials: 'include'
      })
      console.log('Delete listing status:', res.status)
      if (!res.ok) {
        const t = await res.text().catch(()=>null)
        console.error('Delete failed:', res.status, t)
        return
      }
      const data = await res.json()
      if(data.success === false){
        console.log(data.message);
        return
      }
      // remove the deleted listing from local state
      setUserListings((prev)=>prev.filter((listing)=> listing._id !== listingId))

    } catch (error) {
      console.log(error.message);
      
    }
  }
  const handleEditListings = async()=>{
    try {
      
    } catch (error) {
      console.log(error.message);
      
    }
  }



  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center items-start py-10 px-4">
    
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
        Profile
      </h1>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <input
          type="text"
          placeholder="Username"
          className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 outline-none"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Email"
          className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 outline-none"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 outline-none"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-800 text-white rounded-xl py-3 uppercase font-semibold tracking-wide hover:bg-slate-900 transition disabled:opacity-70"
        >
          {loading ? 'Loading...' : 'Update Profile'}
        </button>

        <Link
          to="/create-listing"
          className="bg-green-700 text-white py-3 rounded-xl uppercase text-center font-semibold hover:bg-green-800 transition"
        >
          Create Listing
        </Link>
      </form>

      {/* Actions */}
      <div className="flex justify-between mt-6 text-sm">
        <span
          onClick={handleDelete}
          className="text-red-600 cursor-pointer hover:underline"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-600 cursor-pointer hover:underline"
        >
          Sign Out
        </span>
      </div>

      {/* Messages */}
      {error && (
        <p className="text-red-600 text-center mt-4 font-medium">
          {error}
        </p>
      )}

      {updateSuccess && (
        <p className="text-green-600 text-center mt-4 font-medium">
          User updated successfully
        </p>
      )}

      {/* Show / Hide Listings */}
      {!showListings ? (
        <button
          onClick={handleClickListings}
          className="mt-8 w-full bg-slate-300 text-green-800 py-3 rounded-xl uppercase font-bold hover:opacity-90 transition"
        >
          Show Listings
        </button>
      ) : (
        <button
          onClick={handleHideListings}
          className="mt-8 w-full bg-slate-300 text-red-700 py-3 rounded-xl uppercase font-bold hover:opacity-90 transition"
        >
          Hide Listings
        </button>
      )}

      {showListingError && (
        <p className="text-red-600 text-center mt-4">
          Error Showing Listings
        </p>
      )}

      {/* Listings */}
      {showListings && (
        userListings && userListings.length > 0 ? (
          <div className="mt-10">

            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
              Your Listings
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {userListings.map((listing) => (
                <Link
                  key={listing._id}
                  to={`/listing/${listing._id}`}
                  className="bg-white rounded-xl border shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {(listing.imageUrls?.length > 0 || listing.images?.length > 0) ? (
                    <img
                      src={listing?.imageUrls?.[0] || listing?.images?.[0] || '/placeholder.svg'}
                      alt={listing.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-sm text-gray-500">No image</div>
                  )
                }
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-slate-800">
                      {listing.name}
                    </h3>

                    <p className="text-slate-600 text-sm mt-1">
                      {listing.address}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-green-700 text-lg font-bold">
                        ${listing.regularPrice.toLocaleString()}/month
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${listing.type === 'rent'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                          }`}
                      >
                        {listing.type === 'rent' ? 'Rent' : 'Sale'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 py-4 border-t">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleDeleteListings(listing._id)
                      }}
                      className="text-red-600 uppercase font-semibold hover:underline"
                    >
                      Delete
                    </button>

                    <Link to={`/update-listing/${listing._id}`}>
                      <button className="text-green-700 uppercase font-semibold hover:underline">
                        Edit
                      </button>
                    </Link>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 text-center">
            <p className="text-slate-600 text-lg mb-4">
              You haven't created any listings yet.
            </p>
            <Link
              to="/create-listing"
              className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl uppercase font-semibold hover:bg-green-800 transition"
            >
              Create Your First Listing
            </Link>
          </div>
        )
      )}
    </div>
  </div>
)

}

export default Profile
