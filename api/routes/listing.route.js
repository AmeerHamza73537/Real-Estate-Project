import express from "express";
import {
  createListing,
  deleteListings,
  editListing,
  getListing,
  getListings,
} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListings);
router.post("/update/:id", verifyToken, editListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);
export default router;
