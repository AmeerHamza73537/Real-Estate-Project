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
import ListingItem from '../components/ListingItem'
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
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

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
  <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">

    {/* Sidebar */}
    <aside className="md:w-[340px] w-full bg-white/90 backdrop-blur-xl shadow-xl border-r border-slate-200">
      
      {/* Sidebar Header */}
      <div className="p-6 bg-gradient-to-r from-slate-700 to-slate-800 text-white">
        <h2 className="text-2xl font-bold tracking-wide">Filter Listings</h2>
        <p className="text-sm text-slate-200 mt-1">
          Find your perfect property
        </p>
      </div>

      <form className="p-6 flex flex-col gap-8" onSubmit={handleSubmit}>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="searchTerm"
            placeholder="Location, keyword, area..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-slate-600 focus:border-transparent transition"
            value={sidebardata.searchTerm}
            onChange={handleChange}
          />
        </div>

        {/* Property Type */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Property Type
          </h3>

          <div className="space-y-3 text-sm">
            {[
              { id: 'all', label: 'Rent & Sale' },
              { id: 'rent', label: 'Rent' },
              { id: 'sale', label: 'Sale' },
            ].map(item => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer hover:text-slate-800">
                <input
                  type="checkbox"
                  id={item.id}
                  className="accent-slate-700 w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.type === item.id}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Amenities
          </h3>

          <div className="space-y-3 text-sm">
            {[
              { id: 'offer', label: 'Special Offer' },
              { id: 'furnished', label: 'Furnished' },
              { id: 'parking', label: 'Parking Available' },
            ].map(item => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer hover:text-slate-800">
                <input
                  type="checkbox"
                  id={item.id}
                  className="accent-slate-700 w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata[item.id]}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Sort Results
          </label>
          <select
            id="sort_order"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-slate-600 transition"
            onChange={handleChange}
            defaultValue="created_at_desc"
          >
            <option value="regularPrice_desc">Price: High → Low</option>
            <option value="regularPrice_asc">Price: Low → High</option>
            <option value="createdAt_desc">Newest Listings</option>
            <option value="createdAt_asc">Oldest Listings</option>
          </select>
        </div>

        {/* Button */}
        <button className="mt-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white py-4 rounded-xl font-bold tracking-wide uppercase shadow-lg hover:scale-[1.02] hover:shadow-xl transition hover:cursor-pointer">
          Search Properties
        </button>
      </form>
    </aside>

    {/* Results Section */}
    <section className="flex-1 p-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6">
        
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Listing Results
          </h1>
          <span className="text-sm text-slate-500">
            Showing matching properties
          </span>
        </div>

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-400">
          <p className="text-lg font-semibold">No listings yet</p>
          <p className="text-sm mt-1">
            Search to see available properties
          </p>
        </div>
        )}
        {!loading && listings && 
          listings.map((listing)=>(
            <ListingItem key={listing._id} listing={listing}/>
          )
        )}

      </div>
    </section>

  </div>
)

}
