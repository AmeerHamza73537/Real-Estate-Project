import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return next(
      errorHandler(400, "Please provide username, email, and password")
    );
  }

  // Validate password length
  if (password.length < 6) {
    return next(
      errorHandler(400, "Password must be at least 6 characters long")
    );
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return next(errorHandler(400, "Email already registered"));
      }
      if (existingUser.username === username) {
        return next(errorHandler(400, "Username already taken"));
      }
    }

    const hashPassword = await bcryptjs.hash(password, 12);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res.status(201).json("New User Created Successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return next(errorHandler(400, "Please provide email and password"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not Found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // Destructuring the password so that it does not appear
    const { password: pass, ...rest } = validUser._doc;
    // saving the token as a cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false, // set to false for localhost (no HTTPS)
        sameSite: "lax", // allows cookies to be sent with requests
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};
