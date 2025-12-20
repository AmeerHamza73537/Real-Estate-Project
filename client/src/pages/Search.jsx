// import React, { useEffect, useState } from 'react'
// import { useLocation, Link } from 'react-router-dom'

// export default function Search(){
//   const location = useLocation()
//   const [listings, setListings] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(false)

//   useEffect(()=>{
//     const fetchListings = async ()=>{
//       try{
//         setLoading(true)
//         const res = await fetch(`/api/listing/get${location.search}`)
//         if(!res.ok) throw new Error('Failed fetching')
//         const data = await res.json()
//         setListings(Array.isArray(data)? data : [])
//         setLoading(false)
//         setError(false)
//       }catch(err){
//         console.error('Search fetch error', err)
//         setError(true)
//         setLoading(false)
//       }
//     }
//     fetchListings()
//   },[location.search])

//   const params = new URLSearchParams(location.search)
//   const searchTerm = params.get('searchTerm') || ''

//   return (
//     <main className="p-4 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">Search results for "{searchTerm}"</h1>
//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-600">Error loading listings.</p>}
//       {!loading && !error && listings.length === 0 && (
//         <p className="text-gray-600">No listings found.</p>
//       )}
//       <div className="grid gap-4">
//         {listings.map(l => (
//           <Link key={l._id} to={`/listing/${l._id}`} className="border rounded p-4 flex gap-4 items-center">
//             {l.imageUrls && l.imageUrls[0] && <img src={l.imageUrls[0]} alt={l.name} className="w-24 h-16 object-cover rounded" />}
//             <div>
//               <h3 className="font-semibold">{l.name}</h3>
//               <p className="text-sm text-gray-600">{l.address}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </main>
//   )
// }

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
export default function Search() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const [sidebardata, setSidebardata] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    })

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = useParams.get('type')
        const parkingFromUrl = useParams.get('parking')
        const furnishedFromUrl = useParams.get('furnished')
        const offerFromUrl = useParams.get('offer')
        const sortFromUrl = useParams.get('sort')
        const orderFromUrl = useParams.get('order')

        if(
            searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl
        ){
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true :false,
                furnished: furnishedFromUrl === 'true' ? true :false,
                offer: offerFromUrl === 'true' ? true :false,
                sort: sortFromUrl === 'true' ? true :false,
                order: orderFromUrl === 'true' ? true :false,
            })
        }

        const fetchListings = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json()
            setListings(data)
            setLoading(false)
        }
        fetchListings()

    },[location.search])
    
    const handleChange= (e)=>{
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setSidebardata({...sidebardata, type:e.target.value})
        }
        if(e.target.id === 'searchTerm'){
            setSidebardata({...sidebardata, searchTerm: e.target.value})
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebardata({
                ...sidebardata, 
                [e.target.id]: 
                e.target.checked || e.target.checked === 'true' ? true : false
            })
        }
        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_At'
            const order = e.target.value.split('_')[1] || 'desc'

            setSidebardata({...sidebardata, sort, order})
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('type', sidebardata.type)
        urlParams.set('parking', sidebardata.parking)
        urlParams.set('furnished', sidebardata.furnished)
        urlParams.set('offer', sidebardata.offer)
        urlParams.set('sort', sidebardata.sort)
        urlParams.set('order', sidebardata.order)
        const searchQuery = urlParams.toString()
        navigate(`/search/${searchQuery}`)
    }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
            <div className='flex ites-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                <input 
                    type="text"
                    placeholder='Search...'
                    className='border rounded-lg p-3 w-full'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold'>Type:</label>
                <input 
                    type="checkbox" 
                    id="all" 
                    className='w-5'
                    onChange={handleChange}
                    checked={sidebardata.type === 'all'} 
                />
                <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <input type="checkbox" id="rent" className='w-5'
                    onChange={handleChange}
                    checked={sidebardata.type === 'rent'} 
                />
                <span>Rent</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <input 
                    type="checkbox" 
                    id="sale" 
                    className='w-5'
                    onChange={handleChange}
                    checked={sidebardata.type === 'sale'}
                />
                <span>Sale</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold'>Amenities:</label>
                <input 
                    type="checkbox"
                    id="offer" 
                    className='w-5' 
                    onChange={handleChange}
                    checked={sidebardata.offer}    
                />
                <span>Offer</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <input 
                    type="checkbox" 
                    id="furnished" 
                    className='w-5'
                    onChange={handleChange}
                    checked={sidebardata.furnished}
                />
                <span>Furnished</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <input 
                    type="checkbox" 
                    id="parking" 
                    className='w-5'
                    onChange={handleChange}
                    checked={sidebardata.parking }
                />
                <span>Parking</span>
            </div>
            <div className="flex items-center gap-2">
                <label className='font-semibold'>Sort:</label>
                <select 
                    id="sort_order" 
                    className='border rounded-lg p-3'
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                >
                    <option value="regularPrice_desc">Price High to Low</option>
                    <option value="regularPrice_asc">Price Low to High</option>
                    <option value="createdAt_desc">Latest</option>
                    <option value="createdAt_asc">Oldest</option>
                </select>
            </div>
            <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                Search
            </button>
        </form>
      </div>
      <div className=''>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results:</h1>
      </div>
    </div>
  )
}
