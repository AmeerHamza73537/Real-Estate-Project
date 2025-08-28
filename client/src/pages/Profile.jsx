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
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
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
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
      method: 'DELETE',  
    })
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return
    }
    const data = await res.json()
    dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
    // navigate('/')
  }
  const handleSignOut = async ()=>{
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/sign-out')
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
    </div>
  )
}

export default Profile
