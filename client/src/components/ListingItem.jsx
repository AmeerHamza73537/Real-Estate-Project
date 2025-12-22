import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem() {
  return (
    <div className=''>
      <Link to={`/listing/${Listing._id}`}>
        <img src={Listing.imageUrls[0]} alt="Cover Image" className=''/>
        <div className="">
          <p>{listing.name}</p>
          <div className="">
            <MdLocationOn className=''/>
            <p>{listing.address}</p>
          </div>
          
        </div>
      </Link>
    </div>
  )
}
