import express from 'express'
import { createListing, deleteListings, editListing, getListing, getListings } from '../controller/listing.controller.js'
import { verifyToken } from '../utils/verifyUser.js'
import { upload } from "../middleware/multer.js";
// import UpdateListing from '../../client/src/pages/UpdateListing.jsx';

const router = express.Router()

router.post("/create", verifyToken, upload.array("images", 6), createListing);
router.delete("/delete/:id", verifyToken, deleteListings)
router.post("/update/:id", verifyToken, editListing)
router.get("/get/:id", getListing)
router.get('/get', getListings)
export default router;


