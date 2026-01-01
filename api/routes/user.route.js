import express from "express"
import { test, updateUserInfo, deleteUser, getUserListing, getUser } from "../controller/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()
router.get('/test',test)
router.post('/update/:id', verifyToken, updateUserInfo)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListing)
// router.delete('/logout/:id', verifyToken, logoutUser)
router.get('/:id', verifyToken, getUser)

export default router