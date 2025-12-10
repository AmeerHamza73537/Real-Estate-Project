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
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>
      <form onSubmit={handleSubmit}className="flex flex-col gap-4">
        {/* <input 
          onChange={(e)=>setFile(e.target.files[0])}
          type="file" 
          ref={fileRef} 
          hidden 
          accept='image/*'
        />
        <img 
          onClick={()=> fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt="profile photo" 
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" 
        /> */}
        <input type="text" placeholder='username' className="border p-3 rounded-lg" id='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <input type="email" placeholder='email' className="border p-3 rounded-lg" id='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <input type="password" placeholder='password' className="border p-3 rounded-lg" id='password' onChange={handleChange}/>
        <button disabled={loading}className='bg-slate-900 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled: opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover: opacity-95' to={'/create-listing'}>Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User updated successfully' : ''}</p>
      
      {!showListings ? (
        <button 
          className='text-green-700 w-full bg-[silver] p-3 rounded-lg uppercase text-center hover:opacity-95 hover:cursor-pointer'
          onClick={handleClickListings}
        >
          <b>Show Listings</b>
        </button>
      ) : (
        <button 
          className='text-red-700 w-full bg-[silver] p-3 rounded-lg uppercase text-center hover:opacity-95 hover:cursor-pointer'
          onClick={handleHideListings}
        >
          <b>Hide Listings</b>
        </button>
      )}
      
      <p className='text-red-700 text-center pt-4'>{showListingError ? 'Error Showing Listing' : ''}</p>
      
      {showListings && (
        userListings && userListings.length > 0 ? (
          <div className='mt-5'>
            <h2 className='text-2xl font-semibold mb-4 text-center'>Your Listings</h2>
            <div className='grid grid-cols-1 gap-6'>
              {userListings.map((listing) => (
                <Link key={listing._id} to={`/listing/${listing._id}`} className='border rounded-lg overflow-hidden hover:shadow-lg transition-shadow'>
                  <div className='relative'>
                    {listing.imageUrls && listing.imageUrls.length > 0 && (
                      <img 
                        src={listing.imageUrls[0]} 
                        alt={listing.name} 
                        className='w-full h-48 object-cover'
                      />
                    )}
                    <div className='p-4 bg-white'>
                      <h3 className='text-xl font-semibold text-gray-800'>{listing.name}</h3>
                      <p className='text-gray-600 text-sm mt-2'>{listing.address}</p>
                      <div className='mt-3 flex justify-between items-center'>
                        <span className='text-lg font-bold text-green-700'>
                          ${listing.regularPrice.toLocaleString()}/month
                        </span>
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${listing.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {listing.type === 'rent' ? 'Rent' : 'Sale'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-4">
                    <button className='text-red-700 uppercase' onClick={()=>handleDeleteListings(listing._id)}>Delete</button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-700 uppercase'>Edit</button>
                    </Link>
                  </div>
                </Link>
                
              ))}
            </div>
          </div>
        ) : (
          <div className='mt-10 text-center'>
            <p className='text-gray-600 text-lg mb-4'>You haven't created any listings yet.</p>
            <Link 
              to={'/create-listing'} 
              className='inline-block bg-green-700 text-white px-6 py-3 rounded-lg uppercase hover:opacity-90'
            >
              Create Your First Listing
            </Link>
          </div>

        )
      )}
    </div>
  )
}

export default Profile
