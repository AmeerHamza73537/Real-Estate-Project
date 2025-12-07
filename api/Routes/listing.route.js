import express from 'express'
import { createListing, deleteListings } from '../controller/listing.controller.js'
import { verifyToken } from '../utils/verifyUser.js'
import { upload } from "../middleware/multer.js";

const router = express.Router()

router.post("/create", verifyToken, upload.array("images", 6), createListing);
router.delete("/delete/:id", verifyToken, deleteListings)

export default router;


