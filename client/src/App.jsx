import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signin from './pages/SignIn.jsx'
import SignOut from './pages/SignOut.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/about.jsx'
import Header from './components/header.jsx'
import SignUp from './pages/SignUp.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import CreateListing from './pages/createListing.jsx'
import UpdateListing from './pages/UpdateListing.jsx'

export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/sign-in' element={<Signin/>}/>
        <Route path='/sign-out' element={<SignOut/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>

        <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/create-listing' element={<CreateListing/>}/>
          <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}