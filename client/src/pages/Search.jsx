import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  
  const [showmore, setShowMore] = useState(false)  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl === "true" ? true : false,
        order: orderFromUrl === "true" ? true : false,
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false)
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if(data.length > 8){
        setShowMore(true)
      }else{
        setShowMore(false)
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.value });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_At";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search/${searchQuery}`);
  };
  const onShowMoreClick = async ()=>{
   const numberofListings = listings.length
   const startIndex = numberofListings
   const urlParams = new URLSearchParams(location.search)
   urlParams.set('startIndex', startIndex)
   const searchQuery = urlParams.toString()
   const res = await fetch(`/api/listing/get?${searchQuery}`)
   const data = await res.json()
   if(data.length < 9){
    setShowMore(false)
   } 
   setListings([...listings, ...data])
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
                { id: "all", label: "Rent & Sale" },
                { id: "rent", label: "Rent" },
                { id: "sale", label: "Sale" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 cursor-pointer hover:text-slate-800"
                >
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
                { id: "offer", label: "Special Offer" },
                { id: "furnished", label: "Furnished" },
                { id: "parking", label: "Parking Available" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 cursor-pointer hover:text-slate-800"
                >
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

          {!loading && listings.length === 0 && (
            <div className="p-7">
              <p className="text-lg font-semibold">No listings yet</p>
              <p className="text-sm mt-1">Search to see available properties</p>
            </div>
          )}

          {/* 🔥 GRID – THIS IS THE KEY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading &&
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
              {showmore && (
                <button onClick={onShowMoreClick} className="text-green-700 hover:underline p-7 text-center w-full">Show More</button>
              )}
          </div>
        </div>
      </section>
    </div>
  );
}
