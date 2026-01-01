import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import { uploadImagesToCloudinary } from "../utils/cloudinary.js";

export const createListing = async (req, res, next) => {
  try {
    if (!req.user) return next(errorHandler(401, "Unauthorized"));

    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      images, // Base64 images from client
      imageUrls, // Or already uploaded URLs
    } = req.body;

    // Validate required fields
    if (!name || !description || !address) {
      return next(errorHandler(400, "Please fill in all required fields"));
    }

    let finalImageUrls = [];

    // If images are provided as base64, upload them to Cloudinary
    if (images && Array.isArray(images) && images.length > 0) {
      if (images.length > 6) {
        return next(errorHandler(400, "Maximum 6 images allowed"));
      }
      console.log(
        `[listing] Uploading ${images.length} images to Cloudinary...`
      );
      finalImageUrls = await uploadImagesToCloudinary(images);
      console.log(
        `[listing] Successfully uploaded ${finalImageUrls.length} images`
      );
    }
    // Otherwise use provided URLs
    else if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
      finalImageUrls = imageUrls;
    } else {
      return next(errorHandler(400, "Please upload at least one image"));
    }

    if (regularPrice < 50) {
      return next(errorHandler(400, "Regular price must be at least 50"));
    }

    if (offer && discountPrice >= regularPrice) {
      return next(
        errorHandler(400, "Discount price must be less than regular price")
      );
    }

    const listing = await Listing.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls: finalImageUrls,
      userRef: req.user.id,
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error("[listing] create error", error);
    next(error);
  }
};

export const deleteListings = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const editListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const {
      images, // New base64 images from client
      imageUrls, // Existing URLs to keep
      ...otherData
    } = req.body;

    let finalImageUrls = listing.imageUrls; // Start with existing images

    // If new base64 images are provided, upload them
    if (images && Array.isArray(images) && images.length > 0) {
      console.log(
        `[listing] Uploading ${images.length} new images to Cloudinary...`
      );
      const newUrls = await uploadImagesToCloudinary(images);
      finalImageUrls =
        imageUrls && Array.isArray(imageUrls)
          ? [...imageUrls, ...newUrls] // Combine kept URLs with new ones
          : newUrls; // Just use new ones
      console.log(
        `[listing] Successfully uploaded ${newUrls.length} new images`
      );
    } else if (imageUrls && Array.isArray(imageUrls)) {
      // Just update with the provided URLs (some may have been removed)
      finalImageUrls = imageUrls;
    }

    if (finalImageUrls.length > 6) {
      return next(errorHandler(400, "Maximum 6 images allowed"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...otherData, imageUrls: finalImageUrls },
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error("[listing] update error", error);
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
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

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
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
