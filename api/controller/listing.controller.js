
// export const createListing = async (req, res, next) => {
//   try {
//     if (!req.user) {
//       return next(errorHandler(401, 'Unauthorized'));
//     }

//     const imageUrls = [];
//     console.log("[listing] received files:", req.files?.length || 0);

//     // Upload each file to Cloudinary
//     for (let file of req.files || []) {
//       console.log("[listing] processing file:", file.path);
//       const uploadResult = await uploadonCloudinary(file.path);
//       console.log('[listing] cloudinary uploadResult:', uploadResult && { secure_url: uploadResult.secure_url, public_id: uploadResult.public_id });
//       if (uploadResult && uploadResult.secure_url) {
//         imageUrls.push(uploadResult.secure_url);
//       } else {
//         console.warn("[listing] upload returned null for", file.path);
//         return next(errorHandler(500, 'Failed to upload images'));
//       }
//     }

//     // At least one image required at creation
//     if (imageUrls.length === 0) {
//       return next(errorHandler(400, 'Please upload at least one image'));
//     }

//     console.log("[listing] final imageUrls:", imageUrls);

//     // Build sanitized listing data - convert types from form strings
//     const sanitizeNumber = (v) => (v === undefined || v === null || v === '') ? undefined : Number(v);
//     const sanitizeBool = (v) => (v === 'true' || v === true || v === 'on');

//     const data = {
//       name: req.body.name,
//       description: req.body.description,
//       address: req.body.address,
//       regularPrice: sanitizeNumber(req.body.regularPrice),
//       discountPrice: sanitizeNumber(req.body.discountPrice),
//       bathrooms: sanitizeNumber(req.body.bathrooms),
//       bedrooms: sanitizeNumber(req.body.bedrooms),
//       furnished: sanitizeBool(req.body.furnished),
//       parking: sanitizeBool(req.body.parking),
//       type: req.body.type,
//       offer: sanitizeBool(req.body.offer),
//       imageUrls,
//       userRef: req.user.id,
//     };

//     // Validate required fields quickly
//     const required = ['name', 'description', 'address', 'regularPrice', 'bathrooms', 'bedrooms', 'type'];
// for (const field of required) {
//   if (data[field] === undefined) {
//     return next(errorHandler(400, `${field} is required`));
//   }
// }

// if (data.offer && data.discountPrice === undefined) {
//   return next(errorHandler(400, 'discountPrice is required when offer is true'));
// }


//     // Create Listing with sanitized data
//     const listing = await Listing.create(data);

//     res.status(200).json(listing);
//   } catch (error) {
//     console.error('[listing] create error', error && error.message ? error.message : error);
//     next(error);
//   }
// };



//     let imageUrls = [];
//     if (req.body.imageUrls) {
//       try {
//         if (typeof req.body.imageUrls === 'string') {
//           const parsed = JSON.parse(req.body.imageUrls);
//           if (Array.isArray(parsed)) imageUrls = parsed;
//           else imageUrls = [String(parsed)];
//         } else if (Array.isArray(req.body.imageUrls)) {
//           imageUrls = req.body.imageUrls;
//         } else {
//           imageUrls = listing.imageUrls;
//         }
//       } catch (e) {
//         // fallback: comma-separated
//         if (typeof req.body.imageUrls === 'string') {
//           imageUrls = req.body.imageUrls.split(',').map((s) => s.trim()).filter(Boolean);
//         } else {
//           imageUrls = listing.imageUrls;
//         }
//       }
//     } else {
//       imageUrls = listing.imageUrls;
//     }

//     // ✅ Upload new images if any (and log results)
//     for (const file of req.files || []) {
//       const uploadResult = await uploadonCloudinary(file.path);
//       console.log('[listing] edit cloudinary uploadResult:', uploadResult && { secure_url: uploadResult.secure_url, public_id: uploadResult.public_id });
//       if (uploadResult && uploadResult.secure_url) {
//         imageUrls.push(uploadResult.secure_url);
//       }
//     }
//     const updatedData = {
//       ...req.body,
//       imageUrls,
//     };



import Listing from '../models/listing.model.js';
import { uploadonCloudinary } from '../utils/cloudinary.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    if (!req.user) return next(errorHandler(401, 'Unauthorized'));

    console.log('[listing] content-type:', req.headers['content-type']);
    console.log('[listing] body keys:', Object.keys(req.body || {}));
    console.log('[listing] body:', req.body);
    console.log('[listing] received files:', req.files?.length || 0);

    const imageUrls = [];

    // Upload each file to Cloudinary
    for (let file of req.files || []) {
      console.log('[listing] processing file:', file.path);
      const uploadResult = await uploadonCloudinary(file.path);
      console.log('[listing] cloudinary uploadResult:', uploadResult && { secure_url: uploadResult.secure_url, public_id: uploadResult.public_id });
      if (uploadResult && uploadResult.secure_url) {
        imageUrls.push(uploadResult.secure_url);
      } else {
        console.warn('[listing] upload returned null for', file.path);
        return next(errorHandler(500, 'Failed to upload images'));
      }
    }

    // At least one image required at creation
    if (imageUrls.length === 0) {
      return next(errorHandler(400, 'Please upload at least one image'));
    }

    console.log('[listing] final imageUrls:', imageUrls);

    // Build sanitized listing data - convert types from form strings
    const sanitizeNumber = (v) => (v === undefined || v === null || v === '') ? undefined : Number(v);
    const sanitizeBool = (v) => (v === 'true' || v === true || v === 'on');

    const data = {
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      regularPrice: sanitizeNumber(req.body.regularPrice),
      discountPrice: sanitizeNumber(req.body.discountPrice),
      bathrooms: sanitizeNumber(req.body.bathrooms),
      bedrooms: sanitizeNumber(req.body.bedrooms),
      furnished: sanitizeBool(req.body.furnished),
      parking: sanitizeBool(req.body.parking),
      type: req.body.type,
      offer: sanitizeBool(req.body.offer),
      imageUrls,
      userRef: req.user.id,
    };

    // Validate required fields quickly
    const required = ['name', 'description', 'address', 'regularPrice', 'bathrooms', 'bedrooms', 'type'];
    for (const field of required) {
      if (data[field] === undefined) {
        return next(errorHandler(400, `${field} is required`));
      }
    }

    if (data.offer && data.discountPrice === undefined) {
      return next(errorHandler(400, 'discountPrice is required when offer is true'));
    }

    // Create Listing with sanitized data
    const listing = await Listing.create(data);

    res.status(201).json(listing);
  } catch (error) {
    console.error('[listing] create error', error && error.message ? error.message : error);
    next(error);
  }
};

export const deleteListings = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const editListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};