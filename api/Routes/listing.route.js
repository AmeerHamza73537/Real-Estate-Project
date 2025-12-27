import express from 'express'
import { createListing, deleteListings, editListing, getListing, getListings } from '../controller/listing.controller.js'
import { verifyToken } from '../utils/verifyUser.js'
import upload  from "../middleware/multer.js";

const router = express.Router()

// Public debug route for testing uploads (temporary)
// router.post("/debug-upload", upload.array("images", 6), debugUpload);

// router.post("/create", verifyToken, upload.array("images", 6), createListing);
router.post('/create', verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListings)
router.post("/update/:id", verifyToken, upload.array("images", 6), editListing)
router.get("/get/:id", getListing)
router.get('/get', getListings)
export default router;