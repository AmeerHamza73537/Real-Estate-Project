import express from "express"
import { test, updateUserInfo, deleteUser } from "../controller/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()
router.get('/test',test)
router.post('/update/:id', verifyToken, updateUserInfo)
router.delete('/delete/:id', verifyToken, deleteUser)
// router.delete('/logout/:id', verifyToken, logoutUser)

export default router