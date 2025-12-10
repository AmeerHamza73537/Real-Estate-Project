import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
const UpdateListing = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '', 
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    })
    useEffect(()=>{
        const fetchListing = async ()=>{
            const listingId = params.listingId
        }
        fetchListing()
    }, [])
    
const handleChange = (e) =>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
        setFormData({
            ...formData,
            type: e.target.id
        })
    }
    else if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
        setFormData({
            ...formData,
            // Reason of putting brackets is so that we can get the variable instead of the value
            [e.target.id] : e.target.checked

        })
    }
    else if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
        setFormData({
            ...formData,
            [e.target.id] : e.target.value
        })
    }
}
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (+formData.regularPrice < +formData.discountPrice) {
      return setError('Discounted price cannot be greater than regular price');
    }

    if (files.length === 0) {
      return setError('Please upload at least one image');
    }

    setLoading(true);
    setError(false);

    // ✅ Create FormData correctly
    const form = new FormData();

    // append text fields
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    // append images from files state
    for (let i = 0; i < files.length; i++) {
      form.append("images", files[i]);
    }

        const res = await fetch("/api/listing/create", {
            method: "POST",
            credentials: 'include', // send cookies via proxy
            body: form, // no content-type header! Browser sets it automatically
        });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || 'Failed to update listing');
      return;
    }

    navigate(`/listing/${data._id}`);
  } catch (error) {
    console.log(error);
    setError(error.message);
    setLoading(false);
  }
};

  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
            Update your Listing
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
                <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required onChange={handleChange} value={formData.name}/>
                <textarea placeholder='Description' className='border p-3 rounded-lg' id="description" required onChange={handleChange} value={formData.description}> Description</textarea>
                <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address}/>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="sale" onChange={handleChange} checked={formData.type === 'sale'} />
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="rent" onChange={handleChange} checked={formData.type === 'rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="parking" onChange={handleChange} checked={formData.parking}/>
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="furnished" onChange={handleChange} checked={formData.furnished}/>    
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="offer" onChange={handleChange} checked={formData.offer}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                        <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bedrooms}/>
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" id='bathrooms' min='1' max='100000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathrooms}/>
                        <p>Baths</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" id='regularPrice' min='50' max='1000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice}/>
                        <div className="">
                            <p>Regular Price</p>
                            <span className='text-xs'>$ / month</span>
                        </div>
                    </div>
                    {formData.offer && (
                        <div className="flex items-center gap-2">
                            <input type="number" id='discountPrice' min='50' max='10000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice}/>
                            <div className="flex flex-col items-center">
                                <p>Discounted Price</p>
                                <span className='text-xs'>$ / month</span>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        <span className="font-normal text-gray-600 ml-2">The first image will be the cover(max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input 
                            type="file" 
                            className="bg-[silver] p-3 border border-gray-300 rounded w-full hover:cursor-pointer" 
                            id='images' 
                            accept='image/*' 
                            multiple 
                            onChange={(e) => setFiles(e.target.files)}
                        />
                    </div>
                    {files.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Selected images: {files.length}/6</p>
                            <div className="flex gap-2 flex-wrap">
                                {Array.from(files).map((file, idx) => (
                                    <div key={idx} className="relative">
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            alt="preview" 
                                            className="h-20 w-20 object-cover rounded border"
                                        />
                                        <span className="absolute top-1 right-1 bg-gray-800 text-white text-xs rounded-full px-2">{idx + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <button disabled={loading} className='p-3 bg-slate-700 text-white rounded-lg hover:opacity-90 disabled:opacity-80'>
                        {loading ? 'Updating...' : 'Update Listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
                
        </form>
        
    </main>
  )
}

export default UpdateListing
