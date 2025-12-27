import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './Routes/user.route.js'
import authRoute from './Routes/auth.route.js'
import cookieParser from 'cookie-parser'
import listingRouter from './Routes/listing.route.js'
import cors from 'cors'

import upload from "./middleware/multer.js";
// import path from 'path';
// import { fileURLToPath } from 'url';
// import uploadRoutes from './Routes/upload.route.js';
// import ConnectDb from './config/mongodb.js';

dotenv.config()
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to MONGODB");
}).catch((err)=>{
    console.log(err)
})
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow localhost at any port
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true
}))

app.use('/api/user', userRouter) 
app.use('/api/auth', authRoute)
app.use('/api/listing', listingRouter)

// Middleware to handle errors
app.use((err,req,res,next)=>{
    const statuscode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    console.log(err);
    
    return res.status(statuscode).json({
        success:false,
        statuscode,
        message
    })
})



app.post("/api/upload", upload.array("images", 6), async (req, res) => {
  try {
    console.log("req.files:", req.files);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = req.files.map(f => f.path || f.location);
    res.json({ urls });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});




app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})