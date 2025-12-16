import Listing from "../models/listing.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    let imageUrls = [];
    // Upload each file to Cloudinary
    for (let file of req.files) {
      const uploadResult = await uploadonCloudinary(file.path);
      if (uploadResult) {
        imageUrls.push(uploadResult.secure_url);
      }
    }

    // Create Listing with userRef from authenticated user
    const listing = await Listing.create({
      ...req.body,
      images: imageUrls,
      userRef: req.user.id, // Add the user ID from the verified token
      imageUrls: imageUrls, // Also add as imageUrls if the model expects that
    });
    res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteListings = async (req, res, next) =>{
  try{
    const listing = await Listing.findById(req.params.id)
    if(!listing) return next(errorHandler(404, 'Listing not found'))
    const inString = listing.userRef.toString()
    if(inString !== req.user.id) return next(errorHandler(401, 'You can only delete your own listings.'))
    await Listing.findByIdAndDelete(req.params.id)
    res.status(200).json({message: 'Listing has been deleted.'})
  }catch(error){
    next(error)
  }
}

export const editListing = async (req, res, next) =>{
  const listing = await Listing.findById(req.params.id)
  if(!listing) return next(errorHandler(404, 'Listing not found'))
  const inString = listing.userRef.toString()
  if(inString !== req.user.id) return next(errorHandler(401, 'You can only delete your own listings.'))
  try {
    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true},
    )
    res.status(200).json(updateListing)
  } catch (error) {
    next(error)
  }
}


export const getListing = async (req, res, next)=>{
  try {
    const listing = await Listing.findById(req.params.id)
    if(!listing){
      return next(errorHandler(404, 'Listing not found'))
    }
    res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}

export const getListings = async (req, res, next)=>{
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0
    let offer = req.query.offer
    let furnished = req.query.furnished
    let parking = req.query.parking
    let type = req.query.type

    if(offer === undefined || offer === false){
      offer = {$in:[false, true]}
    }
    if(furnished === undefined || furnished === false){
      furnished = {$in:[false, true]}
    }
    if(parking === undefined || parking === false){
      parking = {$in:[false, true]}
    }
    if(type === undefined || type === 'all'){
      type = {$in:['sale', 'rent']}
    }

    const searchTerm = req.query.searchTerm || ''
    const sort = req.query.sort || 'createdAt'
    const order = req.query.order || 'desc'

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i'},
      offer,
      furnished,
      parking, 
      type,
    }).sort({ [sort]: order, })
    .limit(limit)
    .skip(startIndex);

    return res.status(200).json(listings)


  } catch (error) {
    next(error)
  }
}