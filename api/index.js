import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import cors from "cors";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MONGODB");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(express.json({ limit: "50mb" })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      // Allow localhost at any port
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRouter);

// Middleware to handle errors
app.use((err, req, res, next) => {
  const statuscode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log(err);

  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
